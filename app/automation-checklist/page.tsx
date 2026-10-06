import type { Metadata } from "next";
import ChecklistTool from "@/components/marketing/ChecklistTool";
import { automationChecklist } from "@/lib/lead-magnets";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Automation Readiness Checklist | Triumphant HQ",
  description: automationChecklist.description,
  path: "/automation-checklist",
});

export default function AutomationChecklistPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">{automationChecklist.eyebrow}</p>
        <h1>{automationChecklist.title}</h1>
        <p>{automationChecklist.description}</p>
      </header>
      <ChecklistTool magnet={automationChecklist} />
    </div>
  );
}
