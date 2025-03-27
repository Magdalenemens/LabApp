export class anatomicModel {

    [x: string]: any;
    orD_NO: number = 0;
    arF_ID: number = 0;
    accn: string = '';
    paT_ID: string = '';
    paT_NAME: string = '';
    sex: string = '';
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
    
}

export class apRepportModel {
    arF_ID: number=0; 
    r_STS:string='';   
    notes?: string; 
     // paT_ID?: string;
    // loc?: number;
    // accn?: string;
    // client?: string;
    // cn?: string;
    // dob?: string;
    // doctor?: string;
    // drno?: string;
    // paT_NAME?: string;
    // pr?: string;
    // reQ_CODE?: string;
    // saudi?: string;
    // sex?: string;
    // tcode?: string;
}



