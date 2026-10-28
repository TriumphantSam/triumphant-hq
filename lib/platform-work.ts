export type WorkKind='enquiry'|'booking'|'rehearsal'|'whatsapp';
export type WorkTarget={kind:WorkKind;id:string};
export type WorkSource={label:string;detail:string;state:string;version:number;start?:string;end?:string};
export type FollowUp={dueAt:string;note:string;assigneeId:string|null;done:boolean;version:number};
export type FollowUpView={source:WorkSource;task:FollowUp|null;members:{id:string;name:string}[]};
export type WorkOverview={asOf:string;sandbox:boolean;newEnquiries:number;appointmentsNextDay:number;pausedRehearsals:number;pausedWhatsApp:number;responders:{configured:boolean;enabled:boolean};tasks:(WorkTarget&FollowUp&{label:string;assigneeName:string|null;overdue:boolean})[];truncated:boolean};
