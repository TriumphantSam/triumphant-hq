import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicBusiness from "@/components/platform/PublicBusiness";
import "../../platform/platform.css";
export const metadata: Metadata = {
  title: "Business preview",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  if (!/^[a-f0-9-]{36}$/.test(workspaceId)) notFound();
  return <PublicBusiness workspaceId={workspaceId} />;
}
