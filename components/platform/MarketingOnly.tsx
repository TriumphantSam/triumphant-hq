"use client";
import { usePathname } from "next/navigation";

/** Marketing scripts and agency chrome do not belong in client workspaces. */
export default function MarketingOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return pathname === "/platform" ||
    pathname.startsWith("/platform/") ||
    pathname.startsWith("/business/")
    ? null
    : children;
}
