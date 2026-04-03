'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeoSnapshotPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ websiteUrl: '', name: '', email: '', businessType: '' });

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.websiteUrl || !form.name || !form.email.includes('@')) {
      setErrorMsg('Please fill in all required fields correctly.');
      return;
    }
    setStep('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/seo/quick-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data: Record<string, unknown> = await res.json();

      if (!res.ok) {
        setStep('error');
        setErrorMsg((data.error as string) || 'Something went wrong. Please try again.');
        return;
      }

      if (data.ok) {
        sessionStorage.setItem('trium_seo_result', JSON.stringify(data));
        router.push('/seo-snapshot/results');
      } else {
        setStep('error');
        setErrorMsg((data.error as string) || 'Something went wrong. Please try again.');
      }
    } catch {
      setStep('idle');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  };

  const stats = [
    { value: '68%', label: 'Businesses missing schema' },
    { value: '3×', label: 'More AI citations' },
    { value: '90s', label: 'To get your snapshot' },
  ];

  return (
    <div className="bg-[#020205] min-h-screen relative selection:bg-[#3b82f6]/30 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[1000px] h-[1000px] bg-[#3b82f6]/10 blur-[300px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>
      <div className="relative z-10 w-full pt-32 sm:pt-48 pb-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-14">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60a5fa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#60a5fa]"></span>
              </span>
              <span className="text-sm font-bold tracking-[0.2em] text-[#60a5fa] uppercase">100% Free Analysis</span>
            </div>
            <div className="flex flex-col gap-8 items-center">
              <h1 className="text-6xl sm:text-7xl lg:text-[7.5rem] font-bold text-white leading-[1.05] tracking-tight">
                Why is AI <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#3b82f6] bg-[length:200%_auto] animate-gradient block pb-4">
                  ignoring your site?
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl">
                Search has changed. Discover exactly what&apos;s blocking your visibility in Google and AI-generated answers with a deep technical snapshot.
              </p>
            </div>
            <div className="pt-6 pb-16 w-full flex justify-center border-b border-white/10">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center justify-center px-10 sm:px-12 lg:px-16 min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5.5rem] bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-black text-sm sm:text-lg lg:text-xl uppercase tracking-widest rounded-full transition-transform hover:-translate-y-1 shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_60px_rgba(59,130,246,0.5)] overflow-hidden w-full sm:w-auto text-center"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 whitespace-nowrap pl-[0.1em] flex items-center justify-center gap-3">
                  RUN FREE SNAPSHOT <span className="text-3xl leading-none transition-transform group-hover:translate-x-2">→</span>
                </span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-8 w-full max-w-4xl mx-auto">
              {stats.map(s => (
                <div key={s.value} className="flex flex-col items-center gap-4 group cursor-default">
                  <span className="text-6xl lg:text-7xl font-black text-white group-hover:text-[#60a5fa] transition-colors">{s.value}</span>
                  <span className="text-lg lg:text-xl text-gray-500 font-medium leading-snug">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-10 lg:h-16 w-full shrink-0 mt-20"></div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#020205]/90 backdrop-blur-lg">
          <div className="relative w-full max-w-2xl bg-[#050510] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start p-8 sm:p-12 pb-4 border-b border-white/5 shrink-0">
              <div className="flex flex-col gap-2 pt-2">
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Run Your Snapshot</h2>
                <p className="text-gray-400 text-lg font-light">Sub-second deep dive. Zero obligations.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-8 sm:p-12 overflow-y-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Website URL *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-lg">https://</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={form.websiteUrl}
                      onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value.replace(/^https?:\/\//, '') }))}
                      className="w-full min-h-[4rem] bg-white/5 border border-white/10 text-white text-lg rounded-2xl pl-24 pr-6 focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] outline-none transition-all placeholder:text-gray-600 block"
                      placeholder="yourdomain.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      className="w-full min-h-[4rem] bg-white/5 border border-white/10 text-white text-lg rounded-2xl px-6 focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] outline-none transition-all placeholder:text-gray-600 block"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      className="w-full min-h-[4rem] bg-white/5 border border-white/10 text-white text-lg rounded-2xl px-6 focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] outline-none transition-all placeholder:text-gray-600 block"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Business Type</label>
                  <div className="relative">
                    <select
                      value={form.businessType}
                      onChange={set('businessType')}
                      className="w-full min-h-[4rem] bg-white/5 border border-white/10 text-white text-lg rounded-2xl px-6 focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] outline-none transition-all appearance-none cursor-pointer block"
                    >
                      <option value="" className="bg-[#050510] text-gray-400">Select business type...</option>
                      <option value="ecommerce" className="bg-[#050510]">E-commerce</option>
                      <option value="local" className="bg-[#050510]">Local Business</option>
                      <option value="saas" className="bg-[#050510]">SaaS / B2B</option>
                      <option value="agency" className="bg-[#050510]">Agency</option>
                      <option value="other" className="bg-[#050510]">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-base flex items-center gap-4">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex flex-col gap-6 mt-4 pb-4">
                  <button
                    type="submit"
                    disabled={step === 'loading'}
                    className="w-full min-h-[5rem] rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-bold tracking-[0.15em] uppercase text-lg sm:text-xl hover:opacity-90 transition-transform hover:scale-[1.02] focus:ring-4 focus:ring-[#3b82f6]/50 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden flex items-center justify-center gap-4 shadow-lg shadow-blue-500/20"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative flex items-center justify-center gap-3 w-full">
                      {step === 'loading' ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-white shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Scanning Architecture...
                        </>
                      ) : (
                        <>Reveal My Snapshot <span className="text-2xl group-hover:translate-x-2 transition-transform shrink-0">→</span></>
                      )}
                    </span>
                  </button>

                  <div className="text-center w-full">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2 font-medium">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Bank-grade encryption. No spam ever.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
