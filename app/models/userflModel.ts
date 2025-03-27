
export class userflModel {
	sno: number = 0;
	useR_FL_ID: number = 0;
	rolE_ID: number = 0;
	rolE_NAME: string = '';
	useR_ROLE: string = '';
	useR_ID: string = '';
	useR_CODE: string = '';
	useR_NAME: string = '';
	fulL_NAME: string = '';
	naT_ID: string = '';
	tel: string = '';
	email: string = '';
	joB_CD: string = '';
	u_LVL: string = '';
	// pasS_WORD:string='';
	deF_SITE: string = '';
	billing: boolean = false;
	ndc: boolean = false;
	npc: boolean = false;
	md: number = 0;
	rao: boolean = false;
	amin: boolean = false;
	lgnlmt: number = 0;
	lgncnt: number = 0;
	prntmod: string = '';
	pagehdr: boolean = false;
	elecsngr: boolean = false;
	esngracs: boolean = false;
	dfltsngr: boolean = false;
	sngrrstrct: boolean = false;
	sP_UPDATE: boolean = false;
	validator: boolean = false;
	vldtprmt: boolean = false;
	rsldprint: boolean = false;
	siteslct: boolean = false;
	sigN_LINE1: string = '';
	sigN_LINE2: string = '';
	notes: string = '';
	sngr: string = null;
	iS_ACTIVE: boolean = false;
	IsEdit: boolean = false;
	IsAdd: boolean = false;

}

export class userJobTypeModel {
	useR_ID: string = '';
	useR_CODE: string = '';
	useR_NAME: string = '';
	fulL_NAME: string = '';
	joB_TLT_ID: number = 0;
	joB_CD: string = '';
	joB_TITLE: string = '';
}

export class userRoleModel {
	rolE_ID: number = 0;
	rolE_NAME: string = '';
}


export class userAccessModel {
	cM_ACCESS_ID: number = 0;
	useR_ID: string = '';
	sitE_NO: string = '';
	sitE_NAME: string = '';
	mdl: string = '';
	a_VIEW: number = 0;
	a_EDIT: number = 0;
	a_VERIFY: number = 0;
	a_VALIDATE: number = 0;
	a_AMEND: number = 0;
	a_PRINT: number = 0;
}

