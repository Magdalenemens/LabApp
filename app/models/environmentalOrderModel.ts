export class environmentalOrderModel {
    sno: number = 0;
    paT_ID: string = '';
    paT_NAME: string = '';
    s_TYPE: string = '';
    cn: string = '';
    cash: boolean = false;
    cuS_NAME: string = '';
    cuS_TP: string = '';
    issU_DATE: string = '';
    reF_NO: string = '';
    voL_WT: string = '';
    voL_WT2: string = '';
    batchA_NO: string = '';
    tel: string = '';
    email: string = '';
    cperson: string = '';
    rcvD_DATE: string = '';
    phyS_COND: string = '';
    origin: string = '';
    citY_CNTRY: string = '';
    address: string = '';
    custoM_SR: string = '';
    prD_DATE: string = '';
    expR_DATE: string = '';
    asT_DATE: string = '';
    client: string = '';
    orD_NO: string = '';
    cnclient: string = '';
    sP_DESCRP: string = '';
    stypesP_DESCRP: string = '';
    paytp: string = '';
    paid: string = '';
    rmng: string = '';
    dscamnt: string = '';
    totdscnt: string = '';
    toT_VALUE: string = '';
    neT_VALUE: string = '';
    vat: string = '';
    granD_VAL: string = '';
    vC_NO: string = '';
    inV_DATE: string = '';
    atR_ID: string = '';
    brand: string = '';
    expirY_PERIOD: string = '';
    search: string = '';
    extradiscount: string = '';
    otp: string = '';
}

export class environmentOrderATR {
    atR_ID: number = 0;
    sno: number;
    sitE_NO: string = '';
    orD_NO: string = '';
    paT_ID: string = '';
    accn: string = '';
    reQ_CODE: string = '';
    reQ_DTTM: string = '';
    drawN_DTTM: string = '';
    fulL_NAME: string = '';
    tesT_ID: string = '';
    b_NO: string = '';
    ct: string = '';
    rsld: string = '';
    vldt: string = '';
    s_TYPE: string = '';
    sP_SITE: string = '';
    nO_SLD: string = '';
    sts: string = '';
    prty: string = '';
    r_STS: string = '';
    mdl: string = '';
    div: string = '';
    sect: string = '';
    wc: string = '';
    ts: string = '';
    o_ID: string = '';
    x_ID: string = '';
    ruN_NO: string = '';
    cnld: string = '';
    sf: string = '';
    lf: string = '';
    rno: string = '';
    rpT_NO: string = '';
    notes: string = '';
    ln: string = '';
    uprice: string = '';
    dscntg: string = '';
    dt: string = '';
    dscnt: number = 0;
    dprice: number = 0;
    bprice: string = '';
    kp: string = '';
    atrid: string = '';
    prid: string = '';
    seq: string = '';
    mdf: string = '';
    lasT_UPDT: string = '';
    updT_TIME: string = '';
    vC_NO: string = '';
    inV_DATE: string = '';
}

export class evClient {
    cn: string = '';
    client: string = '';
    cnclient: string = '';
    clnT_ADDRESS: string = '';
}

export class evSample {
    id: number;
    s_TYPE: string = '';
    sP_DESCRP: string = '';
}

export class evPatientID {
    paT_ID: string = '';
}

export class evSignUser {
    id: number;
    name: string = '';
}

export class evOTP {
    otp: number;
    descrip: string = '';
}


export class evPrintModel {

    sno: number;
    atR_ID: string = '';
    sitE_NO: string = '';
    orD_NO: string = '';
    paT_ID: string = '';
    accn: string = '';
    reQ_CODE: string = '';
    reQ_DTTM: string = '';
    drawN_DTTM: string = '';
    fulL_NAME: string = '';
    tesT_ID: string = '';
    b_NO: string = '';
    ct: string = '';
    rsld: string = '';
    vldt: string = '';
    s_TYPE: string = '';
    sP_SITE: string = '';
    nO_SLD: string = '';
    sts: string = '';
    prty: string = '';
    r_STS: string = '';
    mdl: string = '';
    div: string = '';
    sect: string = '';
    wc: string = '';
    ts: string = '';
    o_ID: string = '';
    x_ID: string = '';
    ruN_NO: string = '';
    cnld: string = '';
    sf: string = '';
    lf: string = '';
    rno: string = '';
    rpT_NO: string = '';
    notes: string = '';
    ln: string = '';
    uprice: string = '';
    dscntg: string = '';
    dt: string = '';
    dscnt: number = 0;
    dprice: number = 0;
    bprice: string = '';
    kp: string = '';
    atrid: string = '';
    prid: string = '';
    seq: string = '';
    mdf: string = '';
    lasT_UPDT: string = '';
    updT_TIME: string = '';
    paT_NAME: string = '';
    client: string = '';
    clnvat: string = '';
}


export class evListPrintModel {
    orderNo: string = '';
}


export class evListMultiInvoicePrintModel {
    clientNo: string = '';
    SinceDate: string = '';
    Search: string = '';
}

export class evCancelReason {
    cnlsD_ID: number = 0;
    cc: string = '';
    reason: string = '';
    descrip: string = '';
}
export class evFilterList {
    samplE_ID: string = '';
    samplE_NAME: string = '';
    cn: string = '';
    client: string = '';
    reQ_CODE: string = '';
    ordeR_DTM: string = '';
    reF_DATE: string = '';
    pending: string = '';
}