import Link from "next/link";
import Script from "next/script";

type ConfirmedPageProps = {
  searchParams: Promise<{
    status?: string;
    tx_ref?: string;
  }>;
};

export const metadata = {
  title: "Payment Received | Digital Forge",
  description: "Your Digital Forge payment is being verified for delivery.",
};

export default async function DigitalForgeCheckoutConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const params = await searchParams;
  const status = (params.status ?? "").toLowerCase();
  const isSuccess = !status || status === "successful" || status === "completed";

  return (
    <div className="min-h-screen pb-24 bg-[#030614] text-white font-sans selection:bg-blue-500/30">
      {isSuccess && (
        <Script id="meta-pixel-purchase">
          {`if (typeof fbq !== 'undefined') fbq('track', 'Purchase');`}
        </Script>
      )}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 -left-[10%] w-[50%] h-[60%] rounded-full blur-[140px] mix-blend-screen ${isSuccess ? 'bg-emerald-600/15' : 'bg-amber-600/15'}`} />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030614]/80 to-[#030614]" />
        </div>

        <div className="max-w-screen-md mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-70 transition-all duration-500 ${isSuccess ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/10 group-hover:blur-2xl' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/10'}`} />
            <div className={`relative bg-[#0A0F24]/95 backdrop-blur-2xl border rounded-[2rem] p-10 md:p-14 shadow-2xl ${isSuccess ? 'border-emerald-500/30' : 'border-amber-500/30'}`}>
              
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-8 mx-auto shadow-inner">
                {isSuccess ? (
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
              </div>

              <p className={`text-center text-xs font-bold tracking-[0.2em] uppercase mb-4 ${isSuccess ? "text-emerald-400" : "text-amber-400"}`}>
                {isSuccess ? "Payment received" : "Payment update"}
              </p>

              <h1 className="text-white text-center text-[clamp(2rem,4vw,3rem)] font-black leading-[1.1] mb-6 tracking-tight drop-shadow-md">
                {isSuccess ? "Check your email for your Digital Forge access." : "Your payment status still needs attention."}
              </h1>

              <p className="text-white/70 text-center leading-relaxed text-lg mb-10 max-w-xl mx-auto font-medium">
                {isSuccess
                  ? "Once the payment provider confirms the order on our side, we automatically send your delivery email. If you do not see it within a few minutes, check spam or contact support with your payment email."
                  : "We did not get a clean success signal yet. If the payment provider charged you, keep your transaction reference and contact support so we can verify and deliver manually if needed."}
              </p>

              {isSuccess ? (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem] p-8 mb-10 relative overflow-hidden group/box hover:border-blue-500/40 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                  <p className="text-cyan-400 font-bold text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> Start here after delivery
                  </p>
                  <p className="text-white/90 leading-relaxed text-[0.95rem] font-medium mb-4">
                    Open <strong className="text-white bg-white/10 px-2 py-0.5 rounded-md">01 Start Here.pdf</strong> first, then complete the Offer Selection Worksheet before opening the other templates.
                  </p>
                  <div className="h-px w-full bg-white/10 my-4" />
                  <p className="text-white/60 leading-relaxed text-sm">
                    Reply to the delivery email with the product idea you plan to build first. That reply helps us support you and collect real buyer proof only with permission.
                  </p>
                </div>
              ) : null}

              {params.tx_ref ? (
                <div className="text-center mb-10 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/50 text-sm font-medium">
                    Transaction reference:<br/>
                    <strong className="text-white/90 text-lg mt-1 block tracking-wider font-mono">{params.tx_ref}</strong>
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/digital-forge/system"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest bg-gradient-to-br from-blue-600 to-cyan-500 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                >
                  Back to Starter System
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-white/90 font-bold text-sm uppercase tracking-widest border-2 border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 hover:text-white active:scale-[0.98]"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
