
export class loginModel {
    userName: string = '';
    password: string = '';
    siteNo: string = '';
}

export class loginFlModel {
    logiN_FL_ID = 0;
    statioN_ID: string = '';
    u_ID: string = '';
    useR_CODE: string = '';
    fulL_NAME = '';
    iN_DTTM?: Date;
    ouT_DTTM?: Date;
}

export class changePasswordRequestModel {
    currentPassword: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
}