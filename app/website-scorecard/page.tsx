import type { Metadata } from "next";
import ChecklistTool from "@/components/marketing/ChecklistTool";
import { websiteScorecard } from "@/lib/lead-magnets";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Website Scorecard | Triumphant HQ",
  description: websiteScorecard.description,
  path: "/website-scorecard",
});

export default function WebsiteScorecardPage() {
  return (
    <div>
      <header className="page-hero">
        <p className="eyebrow">{websiteScorecard.eyebrow}</p>
        <h1>{websiteScorecard.title}</h1>
        <p>{websiteScorecard.description}</p>
      </header>
      <ChecklistTool magnet={websiteScorecard} />
    </div>
  );
}
