"use client";
export type Signals={assigned?:boolean;isMine?:boolean;assigneeName?:string|null;unreadCount?:number};
export type InboxFilter='all'|'mine'|'unassigned'|'unread';
export function matchesFilter(thread:Signals,filter:InboxFilter){return filter==='all'||(filter==='mine'&&thread.isMine)||(filter==='unassigned'&&!thread.assigned)||(filter==='unread'&&Number(thread.unreadCount)>0);}
export default function InboxFilters({value,onChange,disabled}:{value:InboxFilter;onChange:(value:InboxFilter)=>void;disabled:boolean}){
 return <label>Show conversations<select value={value} disabled={disabled} onChange={e=>onChange(e.target.value as InboxFilter)}><option value="all">All conversations</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option><option value="unread">Unread customer messages</option></select></label>;
}
