import type { Metadata } from "next";
import PlatformWorkspace from "@/components/platform/PlatformWorkspace";
import "./platform.css";

export const metadata: Metadata = {
  title: "Business workspace | TriumphantTech",
  description:
    "Configure your business answers, workflows and customer channels.",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <PlatformWorkspace />;
}
