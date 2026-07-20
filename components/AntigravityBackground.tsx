export default function AntigravityBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[#fafbfd]" />
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 15% -10%, rgba(7, 94, 229, 0.09), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(0, 136, 214, 0.07), transparent 50%), radial-gradient(ellipse 50% 35% at 50% 100%, rgba(7, 94, 229, 0.04), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.9) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
