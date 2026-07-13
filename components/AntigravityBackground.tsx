'use client';

export default function AntigravityBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Background - Clean Premium Light */}
            <div className="absolute inset-0 bg-[#ffffff]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafc]" />

            {/* Hexagon Grid Overlay - Soft Accent */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%230066FF' stroke-width='1.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
                }}
            />

            {/* Circuit Accent - Soft Ambient Blue Glow */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03] animate-pulse"
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f8ff 100%)',
                    top: '-20%',
                    right: '-20%',
                }}
            />
        </div>
    );
}
