import type {WorkspaceSetup} from './platform-setup';
export type PlatformSupport = {
  environment:string;generatedAt:string;period:string;
  business:{id:string;name:string;state:string;configuredPlan:string;version:number};
  setup:WorkspaceSetup;
  access:{active:boolean;mode:'sandbox'|'paid-test'|'paid-live';planId:string|null;replies:number;faqs:number|null;paidThrough:string|null};
  repliesUsed:number;members:number;pendingInvites:number;
};
export type PlatformOverview = {
  environment: string;
  generatedAt: string;
  period: string;
  totals: {businesses:number;published:number;suspended:number;staff:number};
  gates: {platform:boolean;ai:boolean;testBilling:boolean};
  businesses: Array<{
    id:string;name:string;state:string;plan:string;createdAt:string;
    members:number;pendingInvites:number;replies:number;enquiries:number;
    appointments:number;conversations:number;widgetEnabled:number;aiEnabled:number;
    billingState:string|null;paidThrough:string|null;
  }>;
  nextCursor:string|null;
};
