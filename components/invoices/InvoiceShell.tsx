"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/invoices", label: "Invoices", exact: true },
  { href: "/invoices/clients", label: "Clients" },
  { href: "/invoices/templates", label: "Templates" },
];

export default function InvoiceShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/invoices/login";
  const isPrint = pathname.endsWith("/print");

  if (isLogin || isPrint) {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/invoices/auth", { method: "DELETE" });
    router.push("/invoices/login");
    router.refresh();
  }

  return (
    <div className="invoice-app min-h-screen bg-[#f3f6fb]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/invoices" className="font-display text-lg font-bold tracking-[-0.03em] text-slate-950">
              Triumphant<span className="text-[#075ee5]">HQ</span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Invoices
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {links.map((link) => {
                const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      active ? "bg-[#075ee5] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {userName ? <span className="hidden text-sm text-slate-500 sm:inline">{userName}</span> : null}
            <button type="button" onClick={logout} className="invoice-btn-ghost text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
