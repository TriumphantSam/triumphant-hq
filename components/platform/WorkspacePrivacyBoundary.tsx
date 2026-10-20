"use client";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    __triumphMarketingActive?: boolean;
  }
}

/** A fresh document drops SDKs already started on a public marketing page. */
export default function WorkspacePrivacyBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const privatePage =
    pathname === "/platform" ||
    pathname.startsWith("/platform/") ||
    pathname.startsWith("/business/");
  const reload =
    privatePage &&
    typeof window !== "undefined" &&
    window.__triumphMarketingActive === true;
  useLayoutEffect(() => {
    if (reload) window.location.replace(window.location.href);
  }, [reload]);
  return reload ? (
    <p role="status">Opening your private workspace…</p>
  ) : (
    children
  );
}
