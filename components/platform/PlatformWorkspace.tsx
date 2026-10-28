"use client";

import Link from "next/link";
import TrialPanel from './TrialPanel';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Building2,
  BookOpen,
  CalendarDays,
  CreditCard,
  Rocket,
  Check,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare,
  LogOut,
  Inbox,
  ListChecks,
  Globe,
  BarChart3,
} from "lucide-react";
import Turnstile from "@/components/automation/Turnstile";
import WorkspacePanelBoundary from "./WorkspacePanelBoundary";
import TeamPanel,{TeamInvitations} from "./TeamPanel";
import WhatsAppReview from "./WhatsAppReview";
import SetupGuide,{LaunchReadiness} from './SetupGuide';
import type {WorkspaceSetup} from '@/lib/platform-setup';

type Plan = {
  id: string;
  name: string;
  monthlyKobo: number;
  replies: number;
  faqs: number;
  enquiries:number;bookings:number;
};
type Workspace = {
  role: "owner" | "staff";
  id: string;
  name: string;
  description: string;
  contact_url: string;
  state: string;
  plan_id: string;
  version: number;
};
type Faq = { id: string; question: string; answer: string };
type Policy = {
  days: string;
  start_hour: number;
  end_hour: number;
  duration: number;
  buffer: number;
  notice_hours: number;
};
type View = {
  setup:WorkspaceSetup;
  subscription?:{active:boolean;planId:string|null;replies:number;trial?:boolean;trialEndsAt?:string|null};
  billingPlanId?:string|null;
  billingMode?:'test'|'live'|null;
  workspace: Workspace;
  faqs: Faq[];
  policy: Policy;
  plans: Plan[];
  readiness: Record<string, boolean>;
  usage: { kind: string; count: number }[];
};
type Bootstrap = {
  user: { name: string; email: string };
  workspaces: { id: string; name: string; role: string }[];
  plans: Plan[];
};
type Tab =
  "Setup" | "Today" | "Business" | "Answers" | "Appointments" | "Inbox" | "Conversations" | "Autoresponders" | "Website" | "Plans" | "Usage" | "Launch" | "Team";
const TodayPanel=dynamic(()=>import('./TodayPanel'),{loading:()=> <p role="status">Loading daily work…</p>});
const UsagePanel=dynamic(()=>import('./UsagePanel'),{loading:()=> <p role="status">Loading usage…</p>});
const WebsiteWidgetPanel=dynamic(()=>import("./WebsiteWidgetPanel"),{loading:()=> <p role="status">Loading website settings…</p>});
const BillingPanel=dynamic(()=>import("./BillingPanel"),{loading:()=> <p role="status">Loading billing…</p>});
const ConversationStudio = dynamic(() => import("./ConversationStudio"), {
  loading: () => <p role="status">Loading conversation studio…</p>,
});
const InboxPanel = dynamic(() => import("./InboxPanel"), {
  loading: () => <p role="status">Loading business inbox…</p>,
});
const WhatsAppConnect = dynamic(() => import("./WhatsAppConnect"), {
  loading: () => <p role="status">Loading WhatsApp connection…</p>,
});
const tabs = [
  { name: "Setup", icon: ListChecks },
  { name: "Today", icon: CalendarDays },
  { name: "Business", icon: Building2 },
  { name: "Answers", icon: BookOpen },
  { name: "Appointments", icon: CalendarDays },
  { name: "Inbox", icon: Inbox },
  { name: "Conversations", icon: MessageSquare },
  { name: "Autoresponders", icon: MessageSquare },
  { name: "Website", icon: Globe },
  { name: "Plans", icon: CreditCard },
  { name: "Usage", icon: BarChart3 },
  { name: "Launch", icon: Rocket },
  { name: "Team", icon: ShieldCheck },
] as const;
const ngn = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
class PlatformHttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
async function rpc<T>(
  action: string,
  payload?: unknown,
  token?: string,
): Promise<T> {
  const response = await fetch("/api/platform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      payload,
      ...(token ? { turnstileToken: token } : {}),
    }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new PlatformHttpError(
      data.error || "Please try again.",
      response.status,
    );
  return data;
}

export default function PlatformWorkspace() {
  const [account, setAccount] = useState<Bootstrap | null>(null),
    [view, setView] = useState<View | null>(null);
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const [email, setEmail] = useState(""),
    [otp, setOtp] = useState(""),
    [codeSent, setCodeSent] = useState(false),
    [token, setToken] = useState("");
  const [tab, setTab] = useState<Tab>("Setup"),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [contact, setContact] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]),
    [policy, setPolicy] = useState<Policy | null>(null),
    [question, setQuestion] = useState(""),
    [reply, setReply] = useState("");
  function display(data: View) {
    setView(data);
    setName(data.workspace.name);
    setDescription(data.workspace.description);
    setContact(data.workspace.contact_url);
    setFaqs(data.faqs);
    setPolicy(data.policy);
    if(data.workspace.role==="staff")setTab(previous=>['Today','Inbox','Conversations'].includes(previous)?previous:'Today');
  }
  async function bootstrap(preferredId?:string) {
    const data = await rpc<Bootstrap>("bootstrap");
    setAccount(data);
    const selected=data.workspaces.find(w=>w.id===preferredId)||data.workspaces.find(w=>w.id===view?.workspace.id)||data.workspaces[0];
    if (selected)
      display(
        await rpc<View>("workspace.read", {
          workspaceId: selected.id,
        }),
      );
    else setView(null);
  }
  useEffect(() => {
    let active = true;
    rpc<Bootstrap>("bootstrap")
      .then(async (data) => {
        if (!active) return;
        setAccount(data);
        if (data.workspaces[0]) {
          const v = await rpc<View>("workspace.read", {
            workspaceId: data.workspaces[0].id,
          });
          if (active) display(v);
        }
      })
      .catch((error) => {
        if (
          active &&
          (!(error instanceof PlatformHttpError) || error.status !== 401)
        )
          setError(
            error instanceof Error
              ? error.message
              : "The workspace is temporarily unavailable.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function run(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await work();
    } catch (e) {
      if (e instanceof PlatformHttpError && e.status === 401) {
        setAccount(null);
        setView(null);
      }
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function save(action: string, data: Record<string, unknown>) {
    if (!view) return;
    await rpc(action, {
      workspaceId: view.workspace.id,
      version: view.workspace.version,
      ...data,
    });
    display(
      await rpc<View>("workspace.read", { workspaceId: view.workspace.id }),
    );
    setNotice("Changes saved to your business workspace.");
  }

  const displayedPlanId = view?.billingPlanId || view?.workspace.plan_id;
  return (
    <div className="platform ph-no-capture" data-ph-no-capture>
      <header className="platform-header">
        <Link href="/" className="platform-brand">
          <span>T</span> TriumphantTech <small>WORKSPACE</small>
        </Link>
        <Link href="/automation-lab" className="platform-back">
          Explore the demos <ArrowUpRight size={15} />
        </Link>
      </header>
      {loading ? (
        <div className="platform-loading" role="status">
          Opening your workspace…
        </div>
      ) : !account ? (
        <div className="platform-entry">
          <section className="platform-intro">
            <div className="platform-eyebrow">YOUR BUSINESS. CONNECTED.</div>
            <h1>A calmer way to run customer conversations.</h1>
            <p>
              Set up your business answers and appointment rules in one place.
              Test the experience before connecting a customer channel.
            </p>
            <div className="platform-proof">
              <ShieldCheck size={22} />
              <span>
                Your business has its own private workspace.
                <br />
                Sign in securely with a one-time email code.
              </span>
            </div>
            <ol>
              <li>
                <span>01</span> Create your business profile
              </li>
              <li>
                <span>02</span> Configure standard workflows
              </li>
              <li>
                <span>03</span> Test, connect and launch
              </li>
            </ol>
            <p className="platform-muted">
              Private preview · WhatsApp connection and paid subscriptions are
              not open yet.
            </p>
          </section>
          <section className="platform-card platform-login">
            <div className="platform-eyebrow">WELCOME TO YOUR WORKSPACE</div>
            <h2>{codeSent ? "Check your email" : "Let’s get you set up"}</h2>
            <p>
              {codeSent
                ? "Enter the eight-digit code. It expires after five minutes."
                : "New here? Your account is created after you verify your email."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  if (codeSent) {
                    await rpc("auth.verify", { email, otp });
                    await bootstrap();
                  } else {
                    await rpc("auth.send", { email }, token);
                    setCodeSent(true);
                    setToken("");
                  }
                });
              }}
            >
              <label>
                Business email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  disabled={codeSent || busy}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                />
              </label>
              {codeSent ? (
                <label>
                  Email code
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </label>
              ) : (
                <Turnstile onToken={setToken} />
              )}
              <button
                disabled={
                  busy ||
                  (!codeSent &&
                    Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) &&
                    !token)
                }
                className="platform-primary"
              >
                {busy
                  ? "Please wait…"
                  : codeSent
                    ? "Open my workspace"
                    : "Email me a sign-in code"}
              </button>
              {codeSent && (
                <button
                  type="button"
                  className="platform-text-button"
                  disabled={busy}
                  onClick={() => {
                    setCodeSent(false);
                    setOtp("");
                  }}
                >
                  Use another email or request a new code
                </button>
              )}
            </form>
            <p className="platform-muted">
              Verification does not subscribe you to marketing or start a paid
              plan.
            </p>
            {error && (
              <p role="alert" className="platform-error">
                {error}
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="platform-shell">
          <aside className="platform-sidebar">
            <div className="platform-business">
              <span className="platform-avatar">
                {(view?.workspace.name || "B").slice(0, 1)}
              </span>
              <div>
                <strong>{view?.workspace.name || "Your business"}</strong>
                <small>
                  {view ? "Setup in progress" : "Create your workspace"}
                </small>
              </div>
            </div>
            <nav aria-label="Business workspace">
              {tabs.filter(item=>view?.workspace.role!=="staff"||['Today','Inbox','Conversations'].includes(item.name)).map(({ name: label, icon: Icon }) => (
                <button
                  key={label}
                  aria-current={tab === label ? "page" : undefined}
                  onClick={() => {
                    setTab(label);
                    setNotice("");
                    setError("");
                  }}
                  disabled={!view || busy}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="platform-sidebar-bottom">
              <p>
                Signed in as
                <br />
                <strong>{account.user.email}</strong>
              </p>
              <button
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await rpc("auth.logout");
                    setAccount(null);
                    setView(null);
                    setCodeSent(false);
                    setOtp("");
                    setEmail("");
                  })
                }
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
            {account.workspaces.length>0&&<label className="platform-workspace-switch">Business workspace<select aria-label="Choose business workspace" disabled={busy} value={view?.workspace.id||""} onChange={e=>{const id=e.target.value;void run(async()=>{setView(null);setTab("Setup");await bootstrap(id);});}}>{account.workspaces.map(w=><option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}</select></label>}
          </aside>
          <section className="platform-content">
            <div className="platform-title">
              <div>
                <div className="platform-eyebrow">BUSINESS WORKSPACE</div>
                <h1>
                  {view
                    ? tab === "Setup" ? "Your business, step by step."
                    : tab === 'Today' ? 'Your team’s work, in one place.'
                      : tab === "Website" ? "Your assistant, on your website."
                      : tab === "Conversations" ? "Make every conversation count."
                      : tab === "Autoresponders" ? "A helpful reply starts here."
                      : tab === "Team" ? "The right people. The right access."
                      : tab === "Business"
                      ? "Make it your business."
                      : tab === "Answers"
                        ? "Answers you can stand behind."
                        : tab === "Appointments"
                          ? "Your time, on your terms."
                          : tab === "Inbox"
                            ? "Every enquiry has a place."
                            : tab === "Usage" ? "Your allowance, at a glance."
                            : tab === "Plans"
                              ? "Room to grow."
                              : "Know what’s ready."
                    : "Start with your business."}
                </h1>
              </div>
              <span className="platform-status">Private preview</span>
            </div>
            {error && (
              <p role="alert" className="platform-error">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="platform-success">
                <Check size={17} />
                {notice}
              </p>
            )}
            <TeamInvitations onAccepted={id=>run(async()=>{setView(null);setTab("Inbox");await bootstrap(id);})}/>
            {view?.workspace.role==="staff"&&<p className="platform-sandbox">Staff access · You can use this business’s daily work, inbox and conversation rehearsal. The owner manages configuration, billing and team membership.</p>}
            {!view ? (
              <form
                className="platform-card platform-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    const w = await rpc<Workspace>("workspace.create", {
                      name,
                    });
                    await bootstrap(w.id);
                  });
                }}
              >
                <h2>What is your business called?</h2>
                <p>
                  We’ll create a private workspace for your settings and future
                  customer activity.
                </p>
                <label>
                  Business name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </label>
                <button className="platform-primary" disabled={busy}>
                  Create business workspace
                </button>
              </form>
            ) : (
              <>
                {tab === "Setup" && <SetupGuide key={view.workspace.id} workspaceId={view.workspace.id} setup={view.setup} onNavigate={setTab} onChanged={()=>void run(()=>bootstrap(view.workspace.id))}/>}
                {tab === 'Today' && <TodayPanel key={view.workspace.id} workspaceId={view.workspace.id} owner={view.workspace.role==='owner'} onNavigate={setTab}/>}
                {tab === "Usage" && <WorkspacePanelBoundary key={view.workspace.id+tab}><UsagePanel key={view.workspace.id} workspaceId={view.workspace.id}/></WorkspacePanelBoundary>}
                {(tab === "Conversations" || tab === "Autoresponders") && <WorkspacePanelBoundary key={view.workspace.id+tab}><ConversationStudio workspaceId={view.workspace.id} mode={tab === "Conversations"?"conversations":"responders"} onSaved={()=>void run(bootstrap)}/></WorkspacePanelBoundary>}
                {tab==="Website"&&<WorkspacePanelBoundary key={view.workspace.id+tab}><WebsiteWidgetPanel workspaceId={view.workspace.id}/></WorkspacePanelBoundary>}
                {tab==="Team"&&<WorkspacePanelBoundary key={view.workspace.id+tab}><TeamPanel workspaceId={view.workspace.id}/></WorkspacePanelBoundary>}
                {tab === "Business" && (
                  <div className="platform-columns">
                    <form
                      className="platform-card platform-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void run(() =>
                          save("profile.save", {
                            name,
                            description,
                            contactUrl: contact,
                          }),
                        );
                      }}
                    >
                      <h2>Business profile</h2>
                      <p>
                        Keep information clear and accurate. These settings
                        belong only to your business.
                      </p>
                      <label>
                        Business name
                        <input
                          required
                          minLength={2}
                          maxLength={100}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </label>
                      <label>
                        What do you offer?
                        <textarea
                          rows={5}
                          maxLength={1500}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your services and who you help."
                        />
                      </label>
                      <label>
                        Contact page
                        <input
                          type="url"
                          placeholder="https://yourbusiness.com/contact"
                          maxLength={400}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                        />
                      </label>
                      <button className="platform-primary" disabled={busy}>
                        {busy ? "Saving…" : "Save business details"}
                      </button>
                    </form>
                    <section className="platform-card platform-guide">
                      <ShieldCheck size={28} />
                      <h2>Built around your business</h2>
                      <p>
                        Your profile and approved answers form the foundation of
                        your customer experience.
                      </p>
                      <ul>
                        <li>Separate business records</li>
                        <li>Verified email access</li>
                        <li>Saved settings with conflict protection</li>
                      </ul>
                      <p className="platform-muted">
                        Adding a profile does not publish it or connect
                        WhatsApp.
                      </p>
                    </section>
                  </div>
                )}
                {tab === "Answers" && (
                  <div className="platform-columns">
                    <form
                      className="platform-card platform-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void run(() => save("faqs.save", { faqs }));
                      }}
                    >
                      <h2>Approved answers</h2>
                      <p>
                        Add the questions your customers ask most. The private
                        test uses saved answers.
                      </p>
                      {faqs.map((faq, index) => (
                        <fieldset className="platform-faq" key={faq.id}>
                          <legend>Answer {index + 1}</legend>
                          <label>
                            Customer question
                            <input
                              required
                              minLength={3}
                              maxLength={200}
                              value={faq.question}
                              onChange={(e) =>
                                setFaqs(
                                  faqs.map((f) =>
                                    f.id === faq.id
                                      ? { ...f, question: e.target.value }
                                      : f,
                                  ),
                                )
                              }
                            />
                          </label>
                          <label>
                            Your approved answer
                            <textarea
                              required
                              rows={3}
                              maxLength={1500}
                              value={faq.answer}
                              onChange={(e) =>
                                setFaqs(
                                  faqs.map((f) =>
                                    f.id === faq.id
                                      ? { ...f, answer: e.target.value }
                                      : f,
                                  ),
                                )
                              }
                            />
                          </label>
                          <button
                            className="platform-text-button"
                            type="button"
                            onClick={() =>
                              setFaqs(faqs.filter((f) => f.id !== faq.id))
                            }
                          >
                            Remove answer
                          </button>
                        </fieldset>
                      ))}
                      <button
                        type="button"
                        className="platform-secondary"
                        onClick={() =>
                          setFaqs([
                            ...faqs,
                            {
                              id: crypto.randomUUID(),
                              question: "",
                              answer: "",
                            },
                          ])
                        }
                        disabled={
                          faqs.length >=
                          (view.plans.find(
                            (p) => p.id === view.workspace.plan_id,
                          )?.faqs || 20)
                        }
                      >
                        Add an answer
                      </button>
                      <button className="platform-primary" disabled={busy}>
                        Save approved answers
                      </button>
                    </form>
                    <section className="platform-card platform-guide">
                      <MessageSquare size={26} />
                      <h2>Try a saved answer</h2>
                      <p>
                        This private test matches words to your saved questions.
                        It does not send messages, reserve appointments or run
                        an AI model.
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          void run(async () => {
                            const result = await rpc<{ answer: string }>(
                              "assistant.test",
                              {
                                workspaceId: view.workspace.id,
                                question,
                                requestId: crypto.randomUUID(),
                              },
                            );
                            setReply(result.answer);
                          });
                        }}
                      >
                        <label>
                          Test question
                          <input
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            maxLength={800}
                          />
                        </label>
                        <button className="platform-secondary" disabled={busy}>
                          Test saved answers
                        </button>
                      </form>
                      {reply && (
                        <div className="platform-reply" role="status">
                          {reply}
                        </div>
                      )}
                    </section>
                  </div>
                )}
                {tab === "Appointments" && policy && (
                  <form
                    className="platform-card platform-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void run(() =>
                        save("booking.save", {
                          days: JSON.parse(policy.days),
                          startHour: policy.start_hour,
                          endHour: policy.end_hour,
                          duration: policy.duration,
                          buffer: policy.buffer,
                          noticeHours: policy.notice_hours,
                        }),
                      );
                    }}
                  >
                    <h2>Appointment rules</h2>
                    <p>
                      Lagos time (WAT). Saving rules does not publish a booking
                      page.
                    </p>
                    <fieldset className="platform-days">
                      <legend>Working days</legend>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day, i) => (
                          <label key={day}>
                            <input
                              type="checkbox"
                              checked={JSON.parse(policy.days).includes(i)}
                              onChange={(e) => {
                                const days: number[] = JSON.parse(policy.days);
                                setPolicy({
                                  ...policy,
                                  days: JSON.stringify(
                                    e.target.checked
                                      ? [...days, i]
                                      : days.filter((d) => d !== i),
                                  ),
                                });
                              }}
                            />
                            {day}
                          </label>
                        ),
                      )}
                    </fieldset>
                    <div className="platform-field-grid">
                      {[
                        {
                          key: "start_hour",
                          label: "Opening hour (0–23)",
                          min: 0,
                          max: 23,
                        },
                        {
                          key: "end_hour",
                          label: "Closing hour (1–24)",
                          min: 1,
                          max: 24,
                        },
                        {
                          key: "buffer",
                          label: "Buffer between bookings (minutes)",
                          min: 0,
                          max: 120,
                        },
                        {
                          key: "notice_hours",
                          label: "Minimum notice (hours)",
                          min: 1,
                          max: 168,
                        },
                      ].map((f) => (
                        <label key={f.key}>
                          {f.label}
                          <input
                            type="number"
                            min={f.min}
                            max={f.max}
                            required
                            value={policy[f.key as keyof Policy]}
                            onChange={(e) =>
                              setPolicy({
                                ...policy,
                                [f.key]: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                      ))}
                      <label>
                        Appointment length
                        <select
                          value={policy.duration}
                          onChange={(e) =>
                            setPolicy({
                              ...policy,
                              duration: Number(e.target.value),
                            })
                          }
                        >
                          {[15, 30, 45, 60, 90, 120].map((n) => (
                            <option key={n} value={n}>
                              {n} minutes
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button className="platform-primary" disabled={busy}>
                      Save appointment rules
                    </button>
                  </form>
                )}
                {tab === "Inbox" && (
                  <InboxPanel workspaceId={view.workspace.id} whatsappConnected={view.readiness.whatsappConnected} />
                )}
                {tab === "Plans" && (
                  <>
                    <p className="platform-muted">
                      {view.billingPlanId?'Your existing billing agreement determines your plan. Plan changes require support so a second recurring agreement is not created.':'Monthly prices in NGN. Selecting a draft plan configures your workspace; payment and recurring consent are handled separately below.'}
                    </p>
                    <div className="platform-plans">
                      {view.plans.map((plan) => (
                        <section
                          className={`platform-card platform-plan ${plan.id === displayedPlanId ? "selected" : ""}`}
                          key={plan.id}
                        >
                          <div className="platform-eyebrow">{plan.name}</div>
                          <h2>
                            {ngn(plan.monthlyKobo)}
                            <small>/ month</small>
                          </h2>
                          <ul>
                            <li>
                              {plan.replies.toLocaleString()} assistant replies
                            </li>
                            <li>Up to {plan.faqs} approved answers</li>
                            <li>{plan.enquiries.toLocaleString()} new enquiries / month</li><li>{plan.bookings.toLocaleString()} new booking records / month</li><li>Optional AI matching: up to {plan.replies.toLocaleString()} attempts / month; shared daily safety cap applies</li><li>Standard enquiry and appointment workflows</li>
                            <li>One WhatsApp number when connected</li>
                          </ul>
                          <button
                            className={
                              plan.id === displayedPlanId
                                ? "platform-secondary"
                                : "platform-primary"
                            }
                            disabled={
                              busy || Boolean(view.billingPlanId) || plan.id === displayedPlanId
                            }
                            onClick={() =>
                              void run(() =>
                                save("plan.select", { planId: plan.id }),
                              )
                            }
                          >
                            {plan.id === displayedPlanId
                              ? view.billingPlanId ? 'Subscription plan' : 'Draft plan selected'
                              : view.billingPlanId ? 'Contact support to change' : 'Choose draft plan'}
                          </button>
                        </section>
                      ))}
                    </div>
                    <div className="platform-card">
                      <h2>Clear limits. No surprise overages.</h2>
                      <p>
                        WhatsApp provider charges, taxes and final usage terms
                        need confirmation before paid activation. Website design
                        and custom integrations are separately quoted. Checkout
                        {view.billingMode==='live'?'uses Paystack for your agreed monthly plan.':'is not enabled for live payments.'}
                      </p>
                    </div>
                    <TrialPanel key={view.workspace.id+":trial"} workspaceId={view.workspace.id} access={view.subscription} onChanged={()=>{void rpc<View>('workspace.read',{workspaceId:view.workspace.id}).then(display).catch(()=>setNotice('Reload the workspace to see your trial.'));}}/>
                    <WorkspacePanelBoundary key={view.workspace.id+":billing"}><BillingPanel workspaceId={view.workspace.id} plans={view.plans} onChanged={()=>{void rpc<View>('workspace.read',{workspaceId:view.workspace.id}).then(display).catch(()=>setNotice('Billing updated. Reload the workspace to refresh your plan.'));}}/></WorkspacePanelBoundary>
                  </>
                )}
                {tab === "Launch" && (
                  <>
                    {view.workspace.role==="owner"&&<WhatsAppReview key={view.workspace.id+":review"} workspaceId={view.workspace.id}/>}
                    {view.workspace.role === "owner" && (
                      <WhatsAppConnect
                        workspaceId={view.workspace.id}
                        connected={view.readiness.whatsappConnected}
                        onChanged={() => void run(bootstrap)}
                      />
                    )}
                  <div className="platform-columns">
                    <section className="platform-card platform-form">
                      <h2>Your launch checklist</h2>
                      <p>
                        We show actual readiness. Unavailable connections are
                        never shown as active.
                      </p>
                      <LaunchReadiness setup={view.setup} onNavigate={setTab}/>
                      <div className="platform-sandbox-launch">
                        <p className="platform-muted">
                          Publish a sandbox page to test enquiries and
                          reservations. No notifications or payments are
                          enabled.
                        </p>
                        {view.readiness.websitePublished ? (
                          <>
                            <Link
                              className="platform-primary"
                              href={`/business/${view.workspace.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open sandbox customer page →
                            </Link>
                            <button
                              className="platform-secondary"
                              disabled={busy}
                              onClick={() =>
                                void run(() => save("website.pause", {}))
                              }
                            >
                              Pause sandbox page
                            </button>
                          </>
                        ) : (
                          <button
                            className="platform-primary"
                            disabled={
                              busy ||
                              !view.readiness.profile ||
                              !view.readiness.answers
                            }
                            onClick={() =>
                              void run(() => save("website.publish", {}))
                            }
                          >
                            Publish sandbox page
                          </button>
                        )}
                      </div>
                      <p className="platform-muted">
                        Recorded automated answers this month:{" "}
                        {view.usage.find((u) => u.kind === "assistant_replies")
                          ?.count || 0}{" "}
                        / {view.subscription?.replies??100}. Your verified subscription determines paid allowances.
                      </p>
                      <button className="platform-secondary" disabled>
                        Paid launch unavailable
                      </button>
                    </section>
                    <section className="platform-card platform-guide">
                      <Rocket size={28} />
                      <h2>Set up now. Launch when ready.</h2>
                      <p>
                        The standard workflows are being prepared for customer
                        use. Your business can be configured privately while
                        channel onboarding, billing and delivery checks are
                        completed.
                      </p>
                      <p className="platform-muted">
                        The automation lab shows possibilities. This workspace
                        is where your own business settings live.
                      </p>
                      <Link href="/automation-lab">
                        Explore the automation showroom →
                      </Link>
                    </section>
                  </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      )}
      <footer className="platform-footer">
        <span>TriumphantTech · Business automation</span>
        <div>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
