import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Data Deletion | Triumphant HQ",
  description:
    "How to request deletion of data associated with Triumphant HQ Digital Forge / ForgeGrid Meta applications.",
  path: "/data-deletion",
});

export default function DataDeletionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
