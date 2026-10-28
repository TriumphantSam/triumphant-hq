export type SetupChoices = {businessType:'services'|'appointments'|'shop';appointments:boolean;team:boolean;channel:'whatsapp'|'website'|'both';version:number};
export type SetupStep = {id:string;tab:'Setup'|'Business'|'Answers'|'Appointments'|'Autoresponders'|'Conversations'|'Team';title:string;detail:string;done:boolean;required:boolean};
export type LaunchCheck = {id:string;label:string;state:'ready'|'pending'|'configured'|'blocked'|'not-required';detail:string;tab:'Setup'|'Plans'|'Website'|'Launch'};
export type WorkspaceSetup = {choices:SetupChoices;steps:SetupStep[];completed:number;required:number;preparationComplete:boolean;launchChecks:LaunchCheck[]};
