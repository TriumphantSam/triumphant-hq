'use client';

export default function AntigravityBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]" />

            {/* Floating Orb 1 - Green */}
            <div
                className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full opacity-40 animate-float-slow"
                style={{
                    background: '#00ff88',
                    filter: 'blur(80px)',
                    top: '10%',
                    left: '20%',
                }}
            />

            {/* Floating Orb 2 - Cyan */}
            <div
                className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full opacity-40 animate-float-slower"
                style={{
                    background: '#00ccff',
                    filter: 'blur(80px)',
                    bottom: '10%',
                    right: '10%',
                }}
            />
        </div>
    );
}
