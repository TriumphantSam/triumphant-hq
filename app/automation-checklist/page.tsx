import type { Metadata } from "next";
import ChecklistTool from "@/components/marketing/ChecklistTool";
import { automationChecklist } from "@/lib/lead-magnets";

export const metadata: Metadata = {
  title: "Free Automation Readiness Checklist | Triumphant HQ",
  description: automationChecklist.description,
};

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
