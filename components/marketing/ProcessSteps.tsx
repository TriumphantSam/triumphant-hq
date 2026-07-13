const steps = [
  { number: "01", title: "Discover", copy: "We clarify the business problem, the audience and what success must look like." },
  { number: "02", title: "Design", copy: "We shape the experience, technical approach and execution roadmap before production." },
  { number: "03", title: "Build", copy: "We work in focused iterations, sharing progress and testing the system against real needs." },
  { number: "04", title: "Improve", copy: "We launch carefully, measure what matters and support the next stage of growth." },
];

export default function ProcessSteps() {
  return (
    <div className="process-grid">
      {steps.map((step) => (
        <div className="process-step" key={step.number}>
          <span>{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </div>
      ))}
    </div>
  );
}
