import type { Metadata } from "next";
import ChecklistTool from "@/components/marketing/ChecklistTool";
import { appReadiness } from "@/lib/lead-magnets";

export const metadata: Metadata = {
  title: "Free App Build Readiness Check | Triumphant HQ",
  description: appReadiness.description,
};

export default function AppReadinessPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">{appReadiness.eyebrow}</p>
        <h1>{appReadiness.title}</h1>
        <p>{appReadiness.description}</p>
      </header>
      <ChecklistTool magnet={appReadiness} />
    </div>
  );
}
