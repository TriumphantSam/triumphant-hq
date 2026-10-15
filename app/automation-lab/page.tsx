import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  CreditCard,
  MessageCircle,
  MessageSquare,
  Monitor,
  Star,
  Workflow,
  BellRing,
} from "lucide-react";
import { automationDemos } from "@/lib/automation-lab";
import { buildPageMetadata } from "@/lib/seo";
export const metadata = buildPageMetadata({
  title: "Automation Lab",
  description:
    "Explore seven practical business automation flows, with clear status and real enquiries from TriumphantTech.",
  path: "/automation-lab",
});
const icons = [
  MessageCircle,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Star,
  Monitor,
];
export default function AutomationLab() {
  return (
    <>
      <header className="lab-hero">
        <div className="lab-shell lab-hero-grid">
          <div>
            <p className="lab-kicker">
              <span className="lab-dot" />
              TriumphantTech / Automation Lab
            </p>
            <h1>
              Less busywork.
              <br />
              <em>More business.</em>
            </h1>
            <p className="lab-intro">
              Explore the everyday work a connected business can handle
              automatically. Start with an enquiry. Follow it from capture to
              the next step.
            </p>
            <div className="lab-actions">
              <Link className="lab-link" href="/automation-lab/lead-capture">
                Try lead capture <ArrowRight size={17} />
              </Link>
              <a className="lab-link secondary" href="#automations">
                Explore the lab
              </a>
            </div>
            <p className="lab-note">
              Built around our own business. Each flow shows its current status.
              <br />
              Connected features use real services; planned features are clearly
              marked.
            </p>
          </div>
          <div
            className="lab-flow"
            aria-label="An enquiry moves through capture, business systems and follow-up"
          >
            <p className="lab-flow-title">One enquiry. A connected workflow.</p>
            <div className="lab-flow-node">
              <MessageCircle size={25} />
              <div>
                <strong>A customer reaches out</strong>
                <span>Website · WhatsApp · booking</span>
              </div>
            </div>
            <div className="lab-connector" />
            <div className="lab-flow-node">
              <Workflow size={25} />
              <div>
                <strong>The work finds its place</strong>
                <span>Enquiry · appointment · invoice</span>
              </div>
            </div>
            <div className="lab-connector" />
            <div className="lab-flow-node">
              <BellRing size={25} />
              <div>
                <strong>The right person hears back</strong>
                <span>Confirmation · reminder · owner alert</span>
              </div>
            </div>
            <p className="lab-note">
              The workflow we’re building. No invented results or delivery
              confirmations.
            </p>
          </div>
        </div>
      </header>
      <section className="lab-section lab-shell" id="automations">
        <div className="lab-section-head">
          <div>
            <p className="lab-kicker">Seven everyday workflows</p>
            <h2 className="mt-4">
              See where the time goes.
              <br />
              Then get it back.
            </h2>
          </div>
          <p>
            For a shop, clinic, salon, school or service team. Choose a flow to
            understand the experience and see what is available today.
          </p>
        </div>
        <div className="lab-grid">
          {automationDemos.map((demo, i) => {
            const Icon = icons[i];
            return (
              <article className="lab-card" key={demo.slug}>
                <div className="lab-card-top">
                  <Icon size={27} strokeWidth={1.5} />
                  <span className="lab-number">{demo.number} / 07</span>
                </div>
                <span className="lab-badge">{demo.status}</span>
                <p className="lab-kicker mb-3">{demo.name}</p>
                <h3>{demo.title}</h3>
                <p>{demo.description}</p>
                <p className="lab-audience">{demo.audience}</p>
                <Link href={`/automation-lab/${demo.slug}`}>
                  {demo.action}
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="lab-shell pb-16">
        <div className="lab-banner">
          <div>
            <p className="lab-kicker">Your business, your workflow</p>
            <h2 className="mt-4">Start with one repetitive task.</h2>
            <p>
              Tell us what slows your team down. We’ll help you choose a
              practical first automation.
            </p>
          </div>
          <Link href="/contact?service=automation" className="lab-link">
            Get this for your business <ArrowRight size={17} />
          </Link>
        </div>
        <p className="lab-note">
          Also try the{" "}
          <Link href="/seo-snapshot" className="underline">
            free SEO snapshot
          </Link>{" "}
          to inspect your homepage’s technical foundations.
        </p>
      </section>
    </>
  );
}
