import {Suspense} from "react";
import Link from "next/link";
import {cookies} from "next/headers";
import {ADMIN_COOKIE,adminConfigured,validAdminSession} from "@/lib/admin-lab-auth";
import {automationRequest} from "@/lib/automation-api";
import type {PlatformOverview} from "@/lib/platform-operator";
import AdminLogin from "@/components/automation/AdminLogin";

export const metadata={title:"Platform operations | TriumphantTech",robots:{index:false,follow:false}};
type Query=Promise<Record<string,string|string[]|undefined>>;
async function Overview({searchParams}:{searchParams:Query}) {
  const store=await cookies();
  if(!validAdminSession(store.get(ADMIN_COOKIE)?.value))return <AdminLogin configured={adminConfigured()}/>;
  const query=await searchParams,state=typeof query.state==="string"?query.state:"all",cursor=typeof query.cursor==="string"?query.cursor:"";
  let data:PlatformOverview;
  try {data=await automationRequest("/v1/admin/platform",{state,cursor});}
  catch {return <section className="rounded-2xl border p-6"><h2 className="text-xl font-bold">Overview unavailable</h2><p className="mt-2">Check that this environment has the platform enabled and its database migrations applied.</p><Link className="mt-4 inline-block underline" href="/admin/platform">Retry overview</Link></section>;}
  return <>
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><strong>{data.environment.toUpperCase()} · Read-only operations</strong><p className="mt-2">Business pages and conversation rehearsals are sandbox workflows. Billing below is Paystack TEST billing. These records do not confirm live WhatsApp delivery or paid production access.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Object.entries({Businesses:data.totals.businesses,"Published sandbox pages":data.totals.published,Suspended:data.totals.suspended,"Staff memberships":data.totals.staff}).map(([label,value])=><article key={label} className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></article>)}</div>
    <section className="my-6 rounded-2xl border bg-white p-5"><h2 className="font-bold">Environment controls</h2><div className="mt-3 flex flex-wrap gap-3">{Object.entries({Platform:data.gates.platform,"AI matching":data.gates.ai,"Test billing":data.gates.testBilling}).map(([label,on])=><span key={label} className="rounded-full bg-slate-100 px-4 py-2 text-sm">{label}: {on?"enabled":"disabled"}</span>)}</div><p className="mt-3 text-sm text-slate-600">Configuration flags show availability, not provider health. AI also requires each business’s own permission.</p></section>
    <form className="my-6 flex flex-wrap items-end gap-3" action="/admin/platform"><label className="grid gap-2 font-medium">Business state<select name="state" defaultValue={state} className="rounded-lg border bg-white p-3">{["all","draft","testing","published","suspended"].map(value=><option key={value} value={value}>{value==="all"?"All states":value}</option>)}</select></label><button className="rounded-lg bg-emerald-800 px-5 py-3 text-white">Apply filter</button><Link className="p-3 underline" href="/admin/platform">Refresh all</Link></form>
    <p className="mb-4 text-sm text-slate-600">Totals cover all businesses. Replies show {data.period} in Lagos time; enquiries, confirmed appointments and rehearsals are all-time counts. Page size: 20.</p>
    <div className="grid gap-4 lg:grid-cols-2">{data.businesses.map(b=><article key={b.id} className="min-w-0 rounded-2xl border bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><h2 className="break-words text-xl font-bold">{b.name}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{b.state}</span></div><p className="mt-2 break-all font-mono text-xs text-slate-500">{b.id}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm">{Object.entries({"Configured plan":b.plan,"Team / pending":`${b.members} / ${b.pendingInvites}`,"Sandbox replies":`${b.replies} / 100`,Enquiries:b.enquiries,"Confirmed appointments":b.appointments,Rehearsals:b.conversations,"Website widget":b.widgetEnabled?"Enabled":"Disabled","Business AI permission":b.aiEnabled?"Enabled":"Disabled","Test billing":b.billingState||"Not started","Test paid through":b.paidThrough?new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeZone:"Africa/Lagos"}).format(new Date(b.paidThrough)):"—"}).map(([label,value])=><div key={label}><dt className="text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl></article>)}</div>
    {!data.businesses.length&&<p className="rounded-2xl border p-6">No businesses on this page match the filter.</p>}
    {data.nextCursor&&<Link className="my-6 inline-block rounded-lg bg-emerald-800 px-5 py-3 text-white" href={`/admin/platform?${new URLSearchParams({state,cursor:data.nextCursor})}`}>Next 20 businesses →</Link>}
    <p className="mt-6 text-xs text-slate-500">Loaded {new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Lagos"}).format(new Date(data.generatedAt))} WAT. Reload for current data.</p>
  </>;
}
export default function Page({searchParams}:{searchParams:Query}) {return <main className="mx-auto max-w-6xl px-5 py-10"><Link className="underline" href="/admin">← Owner workspace</Link><p className="mt-8 text-sm font-semibold uppercase tracking-widest text-emerald-800">TriumphantTech · Platform operations</p><h1 className="mb-6 mt-3 text-3xl font-bold">Every business. A clear operating view.</h1><Suspense fallback={<p role="status">Loading private overview…</p>}><Overview searchParams={searchParams}/></Suspense></main>;}
