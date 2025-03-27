import moment from 'moment';

const current = moment();

export class pageTrackRecordModel {
    fK_PAGE_DETAIL_ID: number = 0;
    sessioN_ID: any  = '';
    useR_ID: string= '';
    starT_TIME: string=current.format();
    enD_TIME: string=current.format();
}
export class GetpageTrackRecordModel {
    FK_PAGE_DETAIL_ID: number = 0;
    sessioN_ID: string = '';
    useR_ID: string  = '';
    fulL_NAME: string  = '';
    pagE_NAME: string= '';
    modulE_NAME: string= '';
    url: string= '';
    pagE_DESCRIPTION: string= '';
    sessioN_DURATION_SECONDS: number= 0;
    sessioN_START_TIME: string=current.format();
    sessioN_END_TIME: string=current.format();
    IsEdit:boolean=false;
    IsAdd:boolean=false; 
 
 
}