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
