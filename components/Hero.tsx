'use client';

export default function Hero() {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative">
            {/* Hero Content */}
            <div className="max-w-4xl mx-auto z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                    Essential Tech.<br />Digital Growth.
                </h1>

                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    From local NIMC registrations to global AI data strategies. We bridge the gap between today's needs and tomorrow's technology.
                </p>

                <button
                    className="px-8 py-4 text-lg font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg"
                    style={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--accent-color)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--accent-color)';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.boxShadow = '0 0 20px var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                        e.currentTarget.style.color = 'var(--accent-color)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Explore Solutions
                </button>
            </div>
        </section>
    );
}
