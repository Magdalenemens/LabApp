export class environmentalResultModel {
    sno : number = 0;
    paT_ID: string = '';
    paT_NAME :  string  = '';
    reF_NO: string = '';
    cn: string = '';
    client: string = '';
    orD_NO: string = '';
    accn: string = '';
    rcvD_DATE: string = '';   
    custoM_SR: string = '';   
}

export class environmentalResultARFModel 
{
    accn: string = '';
    updatetype: string = '';
    tcode: string = '';
    reQ_CODE: string = '';
    r_STS: string = '';
    result : string = '';
    f : string = '';
    reF_RANGE: string = '';
    units: string = '';
    fulL_NAME: string = '';
    fulL_NAMEPLUS: string = '';
    rsid : string = '';
    vldt : string = '';
    finding: string = '';
    notes : string = '';
    fnlres : string = '';
    shn : string = '';
}

export class evResultStatus{
    accn  : string = '';
    r_STS : string = '';
    querytype : number = 0;
}


export class evPatientSearchModel {
    id: string=''; 
    name:string='';  
}

export class evSearchModel {
    accn: string=''; 
    orD_NO:string='';  
    tcode:string=''; 
}

export class environmentalDetailModel 
{
    sitE_NO: string = '';
    accn: string = '';
    orD_NO:string='';  
    reQ_CODE: string = '';
    fulL_NAME : string = '';
    paT_ID: string = '';
    paT_NAME : string = '';
    mobile: string = '';
    cn : string = '';
    client : string = '';
    reF_NO: string = '';
    tcode: string = '';
    ordeR_DTTM: string = '';
    coL_DTTM: string = '' ; 
    reS_DTTM: string = '' ; 
    veR_DTTM: string = '' ; 
    vldT_DTTM: string = '' ; 
    o_ID: string = '' ; 
    r_ID: string = '' ; 
    v_ID: string = '' ; 
    vldT_ID: string = '' ; 
    ordereD_BY: string = '' ; 
    resultD_BY: string = '' ; 
    verifieD_BY: string = '' ; 
    validateD_BY: string = '' ; 
    r_STS: string = '' ; 
    shdR_NAME: string = '' ; 
    descrip: string = '' ; 
    clN_IND: string = '' ; 
}