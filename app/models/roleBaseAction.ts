export class roleBaseAction {
    [x: string]: any;
    isAddAccess: boolean = false;
    isAddTestAccess: boolean = false;
    isDeleteTestAccess: boolean = false;
    isCancelAccess: boolean = false;
    isCollectAccess: boolean = false;
    isChangePriceAccess: boolean = false;
    isDeleteAccess: boolean = false;
    isIssueInvoiceAccess: boolean = false;
    isViewAccess: boolean = false;
    isEditAccess: boolean = false;
    isSaveAccess: boolean = false;
    isVerifyAccess: boolean = false;
    isValidateAccess: boolean = false;
    isReleaseAccess: boolean = false;
    isAmendAccess: boolean = false;
    isPrintAccess: boolean = false;
    isMAxisAccess: boolean = false;
    isUploadAccess: boolean = false;
    isModifyAccess: boolean = false;
}


export class moduleBaseAction {
    ordersIsAllow: boolean = false;
    clinicalModulesIsAllow: boolean = false;
    testDirectoryIsAllow: boolean = false;
    financeIsAllow: boolean = false;
    masterSetupIsAllow: boolean = false;
    systemIsAllow: boolean = false;
    managementReportingIsAllow: boolean = false;
}

