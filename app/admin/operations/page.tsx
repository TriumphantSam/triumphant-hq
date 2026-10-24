import {Suspense} from 'react';
import Link from 'next/link';
import {cookies} from 'next/headers';
import {ADMIN_COOKIE,adminConfigured,validAdminSession} from '@/lib/admin-lab-auth';
import {automationRequest} from '@/lib/automation-api';
import type {OperationsHealth} from '@/lib/operations-health';
import AdminLogin from '@/components/automation/AdminLogin';
export const metadata={title:'Operations health | TriumphantTech',robots:{index:false,follow:false}};
async function Health(){
 const store=await cookies();if(!validAdminSession(store.get(ADMIN_COOKIE)?.value))return <AdminLogin configured={adminConfigured()}/>;
 let data:OperationsHealth;
 try{data=await automationRequest('/v1/admin/operations',{});}catch{return <p role="alert">Health checks are unavailable. Check the Worker and database migrations, then reload.</p>;}
 const time=(value:string|null|undefined)=>value?new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(value))+' WAT':'Not recorded';
 return <>
  <section className={`my-6 rounded-2xl border p-6 ${data.attention?'border-amber-300 bg-amber-50':'border-emerald-200 bg-emerald-50'}`}><h2 className="text-xl font-bold">{data.attention?'Attention needed':'No stored delivery warnings'}</h2><p className="mt-2">{data.environment.toUpperCase()} · Checked {time(data.generatedAt)}. This is a stored-job and cron check, not proof of provider or handset delivery. Refresh to check again.</p><Link className="mt-4 inline-block underline" href="/admin/operations">Refresh health</Link></section>
  <section className="my-6 rounded-2xl border p-6"><h2 className="text-xl font-bold">Scheduled processing</h2><p className="mt-3">Last successful completion: {time(data.heartbeat?.lastSuccess)}</p><p>Latest recorded outcome: {data.heartbeat?.lastOutcome||'Unknown'}</p><p className="mt-2">{data.heartbeatAttention?'No recent success or a failed run: inspect the Worker cron and its logs.':'A cron run completed within the last five minutes.'}</p></section>
  <div className="grid gap-4 sm:grid-cols-2">{data.queues.map(queue=><section key={queue.name} className="min-w-0 rounded-2xl border p-5"><h2 className="font-bold">{queue.name}</h2><dl className="mt-3 grid grid-cols-2 gap-3">{Object.entries({Failed:queue.failed,'Unknown outcome':queue.unknown,'Overdue > 15 min':queue.overdue,'Expired lease > 5 min':queue.expiredLeases}).map(([label,count])=><div key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="text-2xl font-semibold">{count}</dd></div>)}</dl></section>)}</div>
  <section className="my-6 rounded-2xl border p-6"><h2 className="font-bold">Invitation email outcomes needing review: {data.invitationAttention}</h2><p className="mt-2">Pending unconfirmed emails or attempts still sending after 15 minutes. Check the provider before any manual resend. Email acceptance does not prove delivery.</p></section>
  <p className="mt-6 text-sm text-slate-600">These alerts stay in this private operator page. No alert emails are enabled. Counts exclude message bodies, customer contacts and provider errors. This page does not monitor Worker outages while you are away, backups, website uptime or every WhatsApp API failure. Do not replay payments or unknown deliveries automatically.</p>
 </>;
}
export default function Page(){return <main className="mx-auto max-w-5xl px-5 py-10"><Link href="/admin" className="underline">← Owner workspace</Link><h1 className="mt-8 text-3xl font-bold">Operations health</h1><Suspense fallback={<p role="status">Loading private health checks…</p>}><Health/></Suspense></main>;}
