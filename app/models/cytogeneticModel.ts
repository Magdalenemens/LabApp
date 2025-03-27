export class cytogeneticModel {
    [x: string]: any;
    arF_ID: number = 0;
    accn: string = '';
    paT_ID: string = '';
    paT_NAME: string = '';
    sex: string = '';
    age: string = '';
    dob: string = '';
    saudi: string = '';
    reQ_CODE: string = '';
    tcode: string = '';
    loc: number = 0;
    pr: string = '';
    cn: string = '';
    client: string = '';
    drno: string = '';
    doctor: string = '';
    sno: number = 0;
    drawN_DTTM!: Date;    
    r_STS:string='';      
    r_ID:string='';     
    v_ID:string='';  
    veR_DTTM!: Date; 
    vldT_ID :string=''; 
    reS_DTTM!: Date;
    rslD_ID:string='';    
    rslD_DTTM!: Date;   
    notes: string = ''; 
    orD_NO: number = 0;
    req_COD:string=''; 
    iscn?:string='';
    figLine1?: string;
    figLine2?:string;
    results:string=''; 
}

export class cgReportModel {
    arF_ID: number=0; 
    iscn:string='';    
    notes?: string; 
    figline1?: string;
    figline2?:string;
    results?: string;
    r_STS?:string;   
}


export class rTestModel{
    rTest? : string;
}


export class txtNameModel{
    r_STS: string;
    r_SEQ: string;
    r_NAME: string;
    r_Result: string;
    r_ArfId : string;
}



export class cgListSearchModel {
    ordeR_FDTTM: string= ''; 
    ordeR_TDTTM:string='';    
    cn: string = ''; 
    sitE_NO: string = ''; 
}












































