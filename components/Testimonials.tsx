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
      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <blockquote key={item.name} className="agency-card">
            <svg className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.2 6C4.3 7.8 3 10 3 13.2 3 16 4.5 18 7 18c2.1 0 3.7-1.5 3.7-3.7 0-2.1-1.5-3.6-3.5-3.6-.5 0-1 .1-1.4.3.5-1.5 1.5-2.8 3.1-4L7.2 6Zm10 0C14.3 7.8 13 10 13 13.2c0 2.8 1.5 4.8 4 4.8 2.1 0 3.7-1.5 3.7-3.7 0-2.1-1.5-3.6-3.5-3.6-.5 0-1 .1-1.4.3.5-1.5 1.5-2.8 3.1-4L17.2 6Z" />
            </svg>
            <p className="mt-5 flex-1 text-[0.96rem] leading-7 text-slate-600">{item.quote}</p>
            <footer className="mt-7 border-t border-slate-200 pt-5">
              <p className="font-bold text-slate-950">{item.name}</p>
              <p className="mt-1 text-xs text-slate-500">{item.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

