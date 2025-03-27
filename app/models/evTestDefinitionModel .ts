export class evTestDefinitionModel {
    sno: number = 0;
    tD_ID: number = 0;
    tcode: string = '';
    tesT_ID: number = 0;
    fulL_NAME: string = '';
    units: string = '';
    prty: string = '';
    status: string = '';
    anL_MTHD_ID: number = 0;
    ordable: string = '';
    pr: string = '';
    mdl: string = '';
    diVs: string = 'd';
    div: string = 's';
    sect: string = '';
    wc: string = '';
    ts: string = '';
    prfx: string = '';
    mhn: string = '';
    shn: string = '';
    tat: number = 0;
    tatu: string = '';
    tatc: string = '';
    taT_MIN: number = 0;
    rstp: string = '';
    dec: number = 0;
    mthd: string = '';
    ct: string = '';
    uprice:string = '';
    selected?: any;
    lbL_CMNT: string = '';
    mthddetails: string = '';
    isEditing?: any;
    editedRow?: boolean;
    // totaL_RECORD?: number = 0;
}

export class evTDReferenceRangeModel {
    sno: number = 0;
    eV_REFRNG_ID = 0;
    tcode: string = '';
    tesT_ID: number = 0;
    s_TYPE: string = '';
    reF_LOW: string = "";
    reF_HIGH: string = "";
    lhf: string = '';
    dec: number = 0;
    sP_DESCRP?: string = '';
    isEditing?: any;
}


export class evProfiledModel {
    sno: number = 0;
    tD_ID: number = 0;
    tcode: string = '';
    tesT_ID: number = 0;
    fulL_NAME: string = '';
}


export class evProfileGTDModel {
    gtD_ID: number = 0;
    sno: number = 0;
    tcode: string = '';
    pndg: string = '';
    reQ_CODE: string = '';
    gtdtcode: string = '';
    profilE_FULLNAME: string = '';
    isEditing?: any;

}

export class anlMethodModel {
  
    sno: number = 0;
    anl_MTHD_ID: number = 0;
    r_MTHD: string = '';
    mthD_NAME: string = '';

}