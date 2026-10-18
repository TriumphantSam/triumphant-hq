import Link from "next/link";
import ConversationAssistant from "@/components/automation/ConversationAssistant";

export const metadata = {
  title: "Business conversation simulator | TriumphantTech",
  description:
    "Try a business assistant with real consultation availability, reviewed next steps and approved service answers. WhatsApp activation is separate.",
};
export default function AssistantPage() {
  return (
    <>
      <header className="lab-hero">
        <div className="lab-shell">
          <Link className="lab-back" href="/automation-lab">
            ← Back to the lab
          </Link>
          <p className="lab-kicker">Conversation preview</p>
          <h1>
            Ask naturally.
            <br />
            Review the next step.
          </h1>
          <p className="lab-intro">
            Explore how a business conversation can lead to a consultation or a
            human handoff. This website simulator uses the shared backend while
            the company WhatsApp connection awaits activation.
          </p>
        </div>
      </header>
      <div className="lab-shell lab-section">
        <ConversationAssistant />
        <p className="lab-note">
          Voice notes, catalogue orders, live invoices and owner write commands
          are future extensions. This preview does not register you for WhatsApp
          messages.
        </p>
      </div>
    </>
  );
}
