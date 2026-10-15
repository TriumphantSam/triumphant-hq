import Link from "next/link";
import { notFound } from "next/navigation";
import { automationDemos } from "@/lib/automation-lab";
import { whatsappLink } from "@/lib/contact";
import LeadDemo from "@/components/automation/LeadDemo";
import BookingDemo from "@/components/automation/BookingDemo";
import AdminDemo from "@/components/automation/AdminDemo";
import ChatDemo from "@/components/automation/ChatDemo";
import ReviewDemo from "@/components/automation/ReviewDemo";
import PaymentDemo from "@/components/automation/PaymentDemo";
export function generateStaticParams() {
  return automationDemos.map((d) => ({ demo: d.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ demo: string }>;
}) {
  const { demo } = await params;
  const item = automationDemos.find((d) => d.slug === demo);
  return { title: item ? `${item.name} | Automation Lab` : "Automation Lab" };
}
export default async function DemoPage({
  params,
}: {
  params: Promise<{ demo: string }>;
}) {
  const { demo } = await params,
    item = automationDemos.find((d) => d.slug === demo);
  if (!item) notFound();
  return (
    <>
      <header className="lab-hero">
        <div className="lab-shell">
          <Link className="lab-back" href="/automation-lab">
            ← Back to the lab
          </Link>
          <p className="lab-kicker">
            {item.number} / {item.name}
          </p>
          <h1>{item.title}</h1>
          <p className="lab-intro">{item.description}</p>
        </div>
      </header>
      <section className="lab-shell lab-section lab-demo">
        <div>
          <span className="lab-badge">{item.status}</span>
          <h2>The customer experience</h2>
          <ol className="lab-steps">
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="lab-script">{item.note}</p>
          <div className="lab-actions">
            <Link
              className="lab-link secondary"
              href="/contact?service=automation"
            >
              Get this for your business
            </Link>
          </div>
        </div>
        {demo === "lead-capture" ? (
          <LeadDemo />
        ) : demo === "booking" ? (
          <BookingDemo />
        ) : demo === "admin" ? (
          <AdminDemo />
        ) : demo === "chat" ? (
          <ChatDemo />
        ) : demo === "reviews" ? (
          <ReviewDemo />
        ) : demo === "payments" ? (
          <PaymentDemo />
        ) : (
          <div className="lab-panel">
            <h2>
              {demo === "whatsapp"
                ? "Try the WhatsApp service menu"
                : demo === "booking"
                  ? "Choose a time to talk"
                  : "Preparing this flow"}
            </h2>
            <p className="lab-placeholder">{item.note}</p>
            {demo === "whatsapp" && (
              <a
                className="lab-link mt-6"
                href={whatsappLink("LAB")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open WhatsApp →
              </a>
            )}
            {!["whatsapp", "booking"].includes(demo) && (
              <p className="lab-note">
                This feature is not yet available as a live demo.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
