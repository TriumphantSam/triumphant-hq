"use client";
import {useEffect,useState} from "react";
type Invite={id:string;email:string;expiresAt:string;emailState:'not-sent'|'sending'|'accepted'|'unconfirmed'};
type Member={userId:string;name:string;email:string;role:string};
async function rpc<T>(action:string,payload:unknown={}) {
  const r=await fetch("/api/platform",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,payload}),cache:"no-store"});
  const data=await r.json();if(!r.ok)throw new Error(data.error||"Please reload your team.");return data as T;
}
export function TeamInvitations({onAccepted}:{onAccepted:(workspaceId:string)=>Promise<void>}) {
  const [invites,setInvites]=useState<Array<{id:string;businessName:string;expiresAt:string}>>([]),[busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{let active=true;rpc<{invitations:typeof invites}>("team.invitations").then(data=>{if(active)setInvites(data.invitations);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
  if(!invites.length&&!error)return null;
  return <section className="platform-card platform-form"><h2>You’ve been invited</h2><p>Accept only businesses you recognise. Staff can view the inbox and practise team replies. Owners control settings, billing and team access.</p>{error&&<p role="alert" className="platform-error">{error}</p>}{invites.map(i=><div key={i.id}><h3>{i.businessName}</h3><button disabled={busy} className="platform-primary" onClick={async()=>{setBusy(true);setError("");try{const result=await rpc<{workspaceId:string}>("team.accept",{inviteId:i.id});setInvites(items=>items.filter(x=>x.id!==i.id));await onAccepted(result.workspaceId);}catch(e){setError(e instanceof Error?e.message:"Please reload invitations.");}finally{setBusy(false);}}}>Join as staff</button></div>)}</section>;
}
export default function TeamPanel({workspaceId}:{workspaceId:string}) {
  function shareInvitation(invite:Invite){setShare(`You’re invited to our TriumphantTech workspace as staff. Open ${window.location.origin}/platform and sign in with ${invite.email}. Accept only the business you recognise. This invitation expires ${new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'}).format(new Date(invite.expiresAt))} WAT. Do not forward sign-in codes.`);}
  const [data,setData]=useState<{members:Member[];invitations:Invite[];limit:number;emailAvailable:boolean}|null>(null),[email,setEmail]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[share,setShare]=useState(""),[sendEmail,setSendEmail]=useState(false);
  useEffect(()=>{let active=true;rpc<typeof data>("team.read",{workspaceId}).then(result=>{if(active)setData(result);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[workspaceId]);
  async function run(action:string,payload:Record<string,unknown>,message:string) {
    if(busy)return;setBusy(true);setError("");setNotice("");setShare("");
    try {
      const result=await rpc<{invitation?:Invite;emailState?:string;emailSent?:boolean}>(action,{workspaceId,...payload});
      setData(await rpc("team.read",{workspaceId}));setNotice(message);
      if(action==='team.email'||(action==='team.invite'&&payload.sendEmail))setNotice(result.emailState==='accepted'?'The email provider accepted the invitation email. Delivery is not yet confirmed.':'The invitation is saved, but the email outcome needs checking. Share the instructions manually; no automatic resend will occur.');
      if(action==="team.invite"){if(result.invitation)shareInvitation(result.invitation);setEmail("");setSendEmail(false);}
    }catch(e){setError(e instanceof Error?e.message:"Please reload the team.");}finally{setBusy(false);}
  }
  return <section className="platform-card platform-form"><p className="platform-eyebrow">People and access</p><h2>Your team, under your control.</h2><p>Invite up to nine colleagues. Staff can use this business’s inbox and conversation rehearsal. They cannot change approved answers, opening hours, autoresponders, website settings, plans, billing or team access.</p>
    {error&&<p role="alert" className="platform-error">{error}</p>}{notice&&<p role="status" className="platform-success">{notice}</p>}
    <form onSubmit={e=>{e.preventDefault();void run("team.invite",{email,sendEmail:sendEmail&&Boolean(data?.emailAvailable)},"Invitation saved. Share the sign-in instructions with your colleague; no email was sent.");}}><label>Colleague’s email<input type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label>{data?.emailAvailable&&<label><input type="checkbox" checked={sendEmail} disabled={busy} onChange={e=>setSendEmail(e.target.checked)}/>Email sign-in instructions to this colleague when I create the invitation.</label>}<button disabled={busy} className="platform-primary">Create staff invitation</button></form>
    <p className="platform-muted">Invitations expire after seven days and work only for the invited verified email. Receiving an email does not grant access; the colleague must sign in and accept.</p>{data&&!data.emailAvailable&&<p>Email invitations are not enabled here. You can still share the sign-in instructions manually.</p>}
    {share&&<label>Share with your invited colleague<textarea readOnly rows={5} value={share} onFocus={e=>e.target.select()}/></label>}
    {!data&&!error&&<p role="status">Loading team…</p>}
    {data&&<>
      <h3>Members ({data.members.length}/{data.limit})</h3>
      {data.members.map(m=><div className="team-person" key={m.userId}><div><strong>{m.name||m.email}</strong><p>{m.email} · {m.role}</p></div>{m.role==="staff"&&<button disabled={busy} className="platform-secondary" onClick={()=>void run("team.remove",{userId:m.userId},"Staff access removed. Their next business request will be refused.")}>Remove staff access</button>}</div>)}
      <h3>Pending invitations</h3>
      {!data.invitations.length&&<p className="platform-muted">No invitations waiting.</p>}
      {data.invitations.map(i=><div className="team-person" key={i.id}>
        <div><strong>{i.email}</strong><p>Expires {new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeZone:"Africa/Lagos"}).format(new Date(i.expiresAt))}</p><p>{i.emailState==='accepted'?'Email accepted by provider; delivery unconfirmed.':i.emailState==='sending'||i.emailState==='unconfirmed'?'Email outcome needs checking. Share instructions manually.':'No invitation email requested.'}</p></div>
        <button disabled={busy} className="platform-secondary" onClick={()=>shareInvitation(i)}>Share instructions</button>
        {data.emailAvailable&&i.emailState==='not-sent'&&<button disabled={busy} className="platform-secondary" onClick={()=>void run('team.email',{inviteId:i.id},'Invitation email requested.')}>Email invitation</button>}
        <button disabled={busy} className="platform-secondary" onClick={()=>void run("team.revoke",{inviteId:i.id},"Invitation withdrawn.")}>Withdraw invitation</button>
      </div>)}
    </>}
    <button disabled={busy} className="platform-secondary" onClick={()=>void run("team.read",{},"Team refreshed.")}>Refresh team</button>
  </section>;
}
