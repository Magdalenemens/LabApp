import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';
import { pageTrackRecordModel } from '../models/pageTrackRecordModel';
import { AuthService } from '../modules/auth/auth.service';
import { HttpService } from '../services/http.service';
import { EncryptionHelper } from '../interceptors/encryption-helper';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  pageTrackRecord: pageTrackRecordModel;

  constructor(private _httpService: HttpService, private _authService: AuthService) { }

  LogPageTimeTrack(pageObj: any) {
    var url = this._httpService.post(cons_baseUrl + `/api/User/insert-pageRecord`, pageObj)
    return url;
  }

  GetPageTimeTrackData(id: any) {
    return this._httpService.get(cons_baseUrl + "/api/User/GetPageRecordByUserId/" + id);
  }

  logPageInOutTime(pageId: number, startTime: string, endTime: string) {
    this.pageTrackRecord = new pageTrackRecordModel();
    this.pageTrackRecord.fK_PAGE_DETAIL_ID = pageId;
    this.pageTrackRecord.useR_ID = EncryptionHelper.decrypt(this._authService.getuserId());//this._authService.getuserId()
    this.pageTrackRecord.starT_TIME = startTime;
    this.pageTrackRecord.enD_TIME = endTime;
    this.pageTrackRecord.sessioN_ID = this._authService.getSessionId();
    this.LogPageTimeTrack(this.pageTrackRecord).subscribe();
  } 
}

