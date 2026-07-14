'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type ReaderState = 'idle' | 'playing' | 'paused';

/** Site-wide: reads `#site-main-content` (layout). Optional: set `data-page-reader-content` on a descendant to read only that region. */
function getReadingRoot(): HTMLElement | null {
    const scoped = document.querySelector('[data-page-reader-content]');
    if (scoped instanceof HTMLElement) return scoped;
    const main = document.getElementById('site-main-content') ?? document.querySelector('main');
    return main instanceof HTMLElement ? main : null;
}

function getReadableText(root: HTMLElement): string {
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('script, style, noscript, iframe, [data-page-reader-ignore]').forEach((el) => el.remove());
    let text = clone.innerText || clone.textContent || '';
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}

/** Split long copy so browsers don’t truncate a single utterance. */
function chunkForSpeech(text: string, maxLen = 320): string[] {
    if (text.length <= maxLen) return [text];
    const chunks: string[] = [];
    let rest = text;
    while (rest.length) {
        if (rest.length <= maxLen) {
            chunks.push(rest.trim());
            break;
        }
        let slice = rest.slice(0, maxLen);
        const lastSpace = slice.lastIndexOf(' ');
        if (lastSpace > 40) slice = rest.slice(0, lastSpace);
        chunks.push(slice.trim());
        rest = rest.slice(slice.length).trim();
    }
    return chunks.filter(Boolean);
}

export default function PageReader() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState<ReaderState>('idle');
    const [expanded, setExpanded] = useState(false);
    const [rate, setRate] = useState(1);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voiceURI, setVoiceURI] = useState<string>('');
    const queueRef = useRef<string[]>([]);
    const indexRef = useRef(0);
    const rateRef = useRef(rate);
    const voiceURIRef = useRef(voiceURI);
    const voicesRef = useRef(voices);
    const speakNextRef = useRef<() => void>(() => {});

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    const speakNext = useCallback(() => {
        const synth = window.speechSynthesis;
        const queue = queueRef.current;
        const i = indexRef.current;
        if (i >= queue.length) {
            setState('idle');
            return;
        }
        const u = new SpeechSynthesisUtterance(queue[i]);
        u.rate = rateRef.current;
        const uri = voiceURIRef.current;
        const list = voicesRef.current;
        if (uri) {
            const v = list.find((x) => x.voiceURI === uri);
            if (v) {
                u.voice = v;
                u.lang = v.lang;
            }
        } else {
            u.lang = 'en-US';
        }
        u.onend = () => {
            indexRef.current += 1;
            speakNextRef.current();
        };
        u.onerror = () => {
            setState('idle');
        };
        synth.speak(u);
    }, []);

    useEffect(() => {
        rateRef.current = rate;
        voiceURIRef.current = voiceURI;
        voicesRef.current = voices;
        speakNextRef.current = speakNext;
    }, [rate, voiceURI, voices, speakNext]);

    const stopAll = useCallback(() => {
        window.speechSynthesis.cancel();
        queueRef.current = [];
        indexRef.current = 0;
        setState('idle');
    }, []);

    const startReading = useCallback(() => {
        window.speechSynthesis.cancel();
        const root = getReadingRoot();
        if (!root) return;
        const text = getReadableText(root);
        if (!text) return;
        queueRef.current = chunkForSpeech(text);
        indexRef.current = 0;
        setState('playing');
        speakNext();
    }, [speakNext]);

    const togglePause = useCallback(() => {
        const synth = window.speechSynthesis;
        setState((s) => {
            if (s === 'playing') {
                synth.pause();
                return 'paused';
            }
            if (s === 'paused') {
                synth.resume();
                return 'playing';
            }
            return s;
        });
    }, []);

    useEffect(() => {
        if (!mounted || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;
        const loadVoices = () => {
            const list = synth.getVoices();
            setVoices(list);
            setVoiceURI((prev) => {
                if (prev) return prev;
                const en = list.find((v) => v.lang.startsWith('en') && v.default) || list.find((v) => v.lang.startsWith('en'));
                return en?.voiceURI ?? '';
            });
        };
        loadVoices();
        synth.addEventListener('voiceschanged', loadVoices);
        return () => synth.removeEventListener('voiceschanged', loadVoices);
    }, [mounted]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        stopAll();
    }, [pathname, stopAll]);

    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    if (!mounted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return null;
    }

    if (pathname.startsWith('/parent-home-routine') || pathname.startsWith('/digital-forge/funnel/')) {
        return null;
    }

    const enVoices = voices.filter((v) => v.lang.startsWith('en'));

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" data-page-reader-ignore>
            {expanded && (
                <div
                    className="glass rounded-2xl border border-[#0066FF]/25 p-4 shadow-lg min-w-[220px] max-w-[min(92vw,280px)]"
                    style={{ background: '#ffffff' }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#0066FF] mb-3">Page reader</p>
                    <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                        Site-wide: reads each page’s main content (not the nav or footer). Add{' '}
                        <code className="text-[10px] text-[#0066FF]">data-page-reader-content</code> on a section to read only that block.
                    </p>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1" htmlFor="page-reader-rate">
                        Speed
                    </label>
                    <input
                        id="page-reader-rate"
                        type="range"
                        min={0.7}
                        max={1.3}
                        step={0.05}
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full mb-3 accent-[#0066FF]"
                    />
                    {enVoices.length > 0 && (
                        <>
                            <label className="block text-xs text-[var(--text-secondary)] mb-1" htmlFor="page-reader-voice">
                                Voice
                            </label>
                            <select
                                id="page-reader-voice"
                                value={voiceURI}
                                onChange={(e) => setVoiceURI(e.target.value)}
                                className="w-full mb-3 text-sm rounded-lg bg-white border border-[#0066FF]/20 text-[var(--text-primary)] px-2 py-1.5 focus:outline-none"
                            >
                                {enVoices.map((v) => (
                                    <option key={v.voiceURI} value={v.voiceURI}>
                                        {v.name} ({v.lang})
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    <div className="flex gap-2">
                        {state === 'idle' ? (
                            <button
                                type="button"
                                onClick={startReading}
                                className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#0066FF] text-white hover:bg-[#0052cc] transition-colors"
                            >
                                Listen
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={togglePause}
                                    className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/10"
                                >
                                    {state === 'playing' ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                    type="button"
                                    onClick={stopAll}
                                    className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    Stop
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-2 rounded-full border border-[#0066FF]/20 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_4px_24px_rgba(0,102,255,0.08)] hover:border-[#0066FF]/60 hover:shadow-[0_8px_28px_rgba(0,102,255,0.15)] transition-all text-sm font-semibold text-[var(--text-primary)]"
                aria-expanded={expanded}
                aria-label={expanded ? 'Close page reader panel' : 'Open page reader — listen to this page'}
            >
                <span className="text-lg leading-none" aria-hidden>
                    🔊
                </span>
                <span className="hidden sm:inline tracking-wide">Listen</span>
            </button>
        </div>
    );
}
