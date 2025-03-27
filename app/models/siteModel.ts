export class siteModel {
    [x: string]: any;
    sitE_DTL_ID: number = 0;
    sitE_NO: string = '';
    cmpnY_NO: string = '';
    company?: string = '';
    sitE_NAME: string = '';
    abrv: string = '';
    reF_SITE_NAME: string = '';
    reF_SITE_SECONDARY_NAME: string = '';
    shortname: string = '';
    aR_SITE_NAME: string = '';
    reF_SITE: string = '';
    reF_SITE_S: string = '';
    sitE_TP: string = '';
    rcvD_COL: number = 0;
    city: string = '';
    address: string = '';
    tel: string = '';
    mobile: string = '';
    latitude: string = '';
    longitude: string = '';
    email: string = '';
    sno: number = 0;
}

export class siteTestsAssignmentModel {
    sitE_TESTS_ID: number = 0;
    sno: number = 0;
    reF_SITE: string = '';
    reF_SITE_S: string = '';
    sitE_NAME: string = '';
    abrv: string = '';
    reF_SITE_NAME: string = '';
    tcode: string = '';
    fulL_NAME: string = '';
    ct: string = '';
    tesT_ID: string = '';
    selecteD_REF_SITE: string = '';
    IsEdit: boolean = false;
    IsAdd: boolean = false;
    IsSave: boolean = false;
    IsCancel: boolean = false;

}

