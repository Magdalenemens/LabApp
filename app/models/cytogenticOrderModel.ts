export class cytogeneticOrderModel {
    sno : number = 0;
    paT_ID : string  = '';
    paT_NAME :  string  = '';
    s_TYPE :  string  = ''; 
    gender :  string  = '';
    dob :  string  = '';
    age : string = '';
    cash : boolean = false;
    nationality : string  = '';
    iqama : string = '';
    orD_SEQ : string = '';
    consent : string = '';
    volume : string = '';
    intgrty : string = '';
    color : string = '';
    pac : string = '';
    cntr : string = '';
    comments : string = '' ;
    cnst  : string = '' ;
    clN_IND  : string = '' ;
    drno  : string = '' ;
    doctor  : string = '' ;        
    reF_NO :  string  = '';
    tel :   string  = '';
    email :   string  = '';
    rcvD_DATE : string  = '';
    cn :  string  = '';
    client  : string = '' ;
    orD_NO : string = '';
    paytp : string = '';
    paid : string = '';
    rmng : string = '';
    dscamnt : string = '';
    totdscnt : string = '';
    toT_VALUE : string = '';
    neT_VALUE : string = '';
    vat : string = '';
    granD_VAL : string = '';
    vC_NO  : string = '';
    inV_DATE : string = '';
    atR_ID : string = '';
    search: string = '';
}

export class cytogeneticOrderATR {
    atR_ID : number = 0;
    sno : number ;
    sitE_NO : string = '';
    orD_NO : string = '';
    paT_ID : string = '';
    accn : string = '';
    reQ_CODE : string = '';
    reQ_DTTM : string = '';
    drawN_DTTM : string = '';
    fulL_NAME : string = '';
    tesT_ID : string = '';
    b_NO : string = '';
    ct : string = '';
    rsld : string = '';
    vldt : string = '';
    s_TYPE : string = '';
    sP_SITE : string = '';
    nO_SLD : string = '';
    sts : string = '';
    prty : string = '';
    r_STS : string = '';
    mdl : string = '';
    div : string = '';
    sect : string = '';
    wc : string = '';
    ts : string = '';
    o_ID : string = '';
    x_ID : string = '';
    ruN_NO : string = '';
    cnld : string = '';
    sf : string = '';
    lf : string = '';
    rno : string = '';
    rpT_NO : string = '';
    notes : string = '';
    ln : string = '';
    uprice : string = '';
    dscntg : string = '';
    dt : string = '';
    dscnt : number = 0;
    dprice : number = 0;
    bprice : string = '';
    kp : string = '';
    atrid : string = '';
    prid : string = '';
    seq : string = '';
    mdf : string = '';
    lasT_UPDT : string = '';
    updT_TIME : string = '';
    vC_NO  : string = '';
    inV_DATE : string = '';
}

export class cgClient{
    cn: string = '';
    client: string = '';
    cnclient: string = '';
}

export class cgSample{
    id: number;
    s_TYPE: string = '';
    sP_DESCRP: string = '';
}

export class cgPatientID{
    paT_ID: string = '';
}


export class cgPrintModel {
    
    sno : number ;
    atR_ID : string = '';
    sitE_NO : string = '';
    orD_NO : string = '';
    paT_ID : string = '';
    accn : string = '';
    reQ_CODE : string = '';
    reQ_DTTM : string = '';
    drawN_DTTM : string = '';
    fulL_NAME : string = '';
    tesT_ID : string = '';
    b_NO : string = '';
    ct : string = '';
    rsld : string = '';
    vldt : string = '';
    s_TYPE : string = '';
    sP_SITE : string = '';
    nO_SLD : string = '';
    sts : string = '';
    prty : string = '';
    r_STS : string = '';
    mdl : string = '';
    div : string = '';
    sect : string = '';
    wc : string = '';
    ts : string = '';
    o_ID : string = '';
    x_ID : string = '';
    ruN_NO : string = '';
    cnld : string = '';
    sf : string = '';
    lf : string = '';
    rno : string = '';
    rpT_NO : string = '';
    notes : string = '';
    ln : string = '';
    uprice : string = '';
    dscntg : string = '';
    dt : string = '';
    dscnt : number = 0;
    dprice : number = 0;
    bprice : string = '';
    kp : string = '';
    atrid : string = '';
    prid : string = '';
    seq : string = '';
    mdf : string = '';
    lasT_UPDT : string = '';
    updT_TIME : string = '';
    paT_NAME: string = '';
    client : string = '';
    clnvat : string = '';
}


export class cgListPrintModel {
    orderNo: string = ''; 
}


export class cgListMultiInvoicePrintModel {
    clientNo: string = ''; 
    SinceDate : string = '';
    Search : string = '';
}

export class cgCancelReason
{
    cnlsD_ID : number=0;
    cc : string = '';
    reason : string = '';
    descrip : string = '';
}