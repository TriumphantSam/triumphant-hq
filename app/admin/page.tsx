import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminConfigured,
  validAdminSession,
} from "@/lib/admin-lab-auth";
import { automationRequest } from "@/lib/automation-api";
import AdminLogin from "@/components/automation/AdminLogin";
import ConversationAssistant from "@/components/automation/ConversationAssistant";
import AdminActions from "@/components/automation/AdminActions";
import LeadManager, {
  type ManagedLead,
} from "@/components/automation/LeadManager";
type Dashboard = {
  report: Record<string, unknown>;
  bookings: {
    id: string;
    name: string;
    email: string;
    slot_start: string;
    slot_end: string;
    completed_at: string | null;
    review_opt_in: number;
  }[];
  leads: ManagedLead[];
  drafts: { id: string; body: string; source: string; state: string }[];
  feedback: { id: string; rating: number; feedback: string; name: string }[];
};
export const metadata = {
  title: "Owner workspace | TriumphantTech",
  robots: { index: false, follow: false },
};
async function AdminContent() {
  const store = await cookies();
  if (!validAdminSession(store.get(ADMIN_COOKIE)?.value))
    return <AdminLogin configured={adminConfigured()} />;
  let dashboard: Dashboard;
  try {
    dashboard = await automationRequest("/v1/admin/dashboard", {
      date: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Lagos",
      }).format(new Date()),
      days: 1,
    });
  } catch {
    return <p>The private backend is unavailable. Please try again later.</p>;
  }
  return (
    <>
      <AdminActions action="logout" label="Sign out" />
      <ConversationAssistant mode="owner" />
      <h2 className="mt-8 text-xl font-bold">
        Real leads and bookings · today in Lagos
      </h2>
      <pre className="my-6 whitespace-pre-wrap break-words rounded bg-slate-100 p-5 text-sm">
        {JSON.stringify(dashboard.report, null, 2)}
      </pre>
      <h2 className="text-xl font-bold">Recent enquiries</h2>
      {dashboard.leads.map((lead) => (
        <LeadManager key={lead.id} lead={lead} />
      ))}
      <h2 className="mt-8 text-xl font-bold">Recent consultations</h2>
      <p>
        Mark a call complete only after delivering the service. A review
        invitation is queued only where permission was recorded, with a 90-day
        limit per customer.
      </p>
      {dashboard.bookings.map((booking) => (
        <article className="my-4 rounded border p-4" key={booking.id}>
          <h3>
            {booking.name} · {booking.email}
          </h3>
          <p>
            {new Date(booking.slot_start).toLocaleString("en-GB", {
              timeZone: "Africa/Lagos",
            })}{" "}
            WAT
          </p>
          <p>
            {booking.review_opt_in
              ? "Review invitation permitted"
              : "No review invitation permission"}
          </p>
          {booking.completed_at ? (
            <p>Service marked complete</p>
          ) : (
            <AdminActions
              action="complete_booking"
              id={booking.id}
              label="Mark delivered consultation complete"
            />
          )}
        </article>
      ))}
      <h2 className="mt-8 text-xl font-bold">Private feedback</h2>
      {dashboard.feedback.map((item) => (
        <article className="my-4 rounded border p-4" key={item.id}>
          <p>
            {item.rating}/5 · {item.name || "Anonymous"}
          </p>
          <p>{item.feedback}</p>
        </article>
      ))}
      <h2 className="mt-8 text-xl font-bold">Source-based social drafts</h2>
      <p>
        These writing templates use verified business facts. They are not
        AI-written and nothing is auto-published.
      </p>
      <AdminActions
        action="generate_drafts"
        label="Prepare this week’s three drafts"
      />
      {dashboard.drafts.map((draft) => (
        <article className="my-4 rounded border p-4" key={draft.id}>
          <p>{draft.body}</p>
          <a className="text-blue-700 underline" href={draft.source}>
            Check the source
          </a>
          <p>{draft.state}</p>
          {draft.state === "draft" && (
            <AdminActions
              action="approve_draft"
              id={draft.id}
              label="Approve draft without publishing"
            />
          )}
        </article>
      ))}
    </>
  );
}
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-bold">TriumphantTech owner workspace</h1>
      <Suspense fallback={<p>Loading private workspace…</p>}>
        <AdminContent />
      </Suspense>
    </main>
  );
}
