type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Triumphant HQ brought clarity to the project from the first conversation. The final experience felt considered, professional and much easier for our customers to use.",
    name: "Chinonso E.",
    role: "Business Owner",
  },
  {
    quote:
      "The implementation order was clear and practical. Instead of another report, we had a partner who could explain the priorities and execute the technical work.",
    name: "Amara O.",
    role: "Marketing Lead",
  },
  {
    quote:
      "The automation setup gave our small team a process we could actually maintain. Follow-up became consistent, and we spend less time moving information manually.",
    name: "Tunde A.",
    role: "Founder, Service Business",
  },
];

export default function Testimonials() {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <p className="eyebrow">Client perspective</p>
        <h2>Professional execution, with a partner who stays close to the problem.</h2>
      </div>
      <div className="grid gap-0 border-t border-slate-200 md:grid-cols-3">
        {TESTIMONIALS.map((item, index) => (
          <blockquote
            key={item.name}
            className={`px-0 py-8 md:px-6 md:py-10 ${index > 0 ? "border-t border-slate-200 md:border-t-0 md:border-l" : ""}`}
          >
            <p className="font-display text-[1.15rem] leading-8 tracking-[-0.02em] text-slate-800">
              “{item.quote}”
            </p>
            <footer className="mt-8">
              <p className="text-sm font-bold text-slate-950">{item.name}</p>
              <p className="mt-1 text-xs tracking-wide text-slate-500">{item.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
