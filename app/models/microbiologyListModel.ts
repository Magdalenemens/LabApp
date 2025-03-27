export class microbiologyListModel {
    arF_ID : number = 0;
    sitE_NO : number = 0;
    accn : string = '';
    reQ_CODE: string = '';
    paT_ID: string = '';
    cn: string = '';
    drno: string = '';
    // ordeR_DTTM: string = '';
    ordeR_DTTMSTR: string = '';
    coL_DTTM: string = '';
    duration: string = '';
    sts: string = '';
    descrip: string = '';
}


export class mbListSearchModel {
    ordeR_FDTTM: string= ''; 
    ordeR_TDTTM:string='';    
    cn: string = ''; 
    sitE_NO: string = ''; 
}

export class mbListQRModel {
    accn: string = ''; 
}
