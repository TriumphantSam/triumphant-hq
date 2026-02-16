'use client';

export default function AntigravityBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Background - Deep Technical Dark */}
            <div className="absolute inset-0 bg-[#050510]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020205]" />

            {/* Hexagon Grid Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%230066FF' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'
                }}
            />

            {/* Circuit Accent - Blue */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full opacity-10 animate-pulse"
                style={{
                    background: 'radial-gradient(circle, #0066FF 0%, transparent 70%)',
                    top: '-20%',
                    right: '-20%',
                }}
            />
        </div>
    );
}
