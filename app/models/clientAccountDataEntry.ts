export class clientAccountDataEntry {
    firsT_ID: number;
    previouS_ID: number;
    nexT_ID: number;
    lasT_ID: number;
    clntacnT_ID: number;    
    cn: string;
    date: Date;
    vC_NO: string;
    rcT_NO: string;
    debit: number;
    credit: number;
    client: string;
    clnT_FL_ID: number;
    tt: string;
    remarks: string;
    balance: number;
    totaL_DAYS: number;
    ytD_DEBIT: number;
    ytD_CREDIT: number;

}

export class clientAccountDataEntryDetails {
    clntacnT_ID: number;
    cn: string;
    date: Date;
    tt: string;
    debit: number;
    credit: number;
    vC_NO: string;
    rcT_NO: string;
    remarks: string;
    client: string;
    ytD_DEBIT: number;
    ytD_CREDIT: number;
    balance: number;
}

export class clientAccountCrossCheckDetails {
    cn: string;
    client: string;
    vC_NO: string;
    inV_DATE: Date;
    granD_VAL:number;
    debit:number;
    diff:number;
}

export class clientAccountCurrentStatusDetails {
    cn: number;
    client: string;
    totdebit: number;
    totcredit:number;
    totbalance:number;
}

