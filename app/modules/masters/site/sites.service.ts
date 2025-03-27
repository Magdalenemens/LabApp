import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { Observable, catchError, throwError } from "rxjs";
import { siteModel } from 'src/app/models/siteModel';
import { loginFlModel } from 'src/app/models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  [x: string]: any;
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  addSite(siteData: siteModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/MasterData/Insert-site", siteData).pipe(
      catchError(err => {
        console.error('error cought in service', err)
        return throwError(err);
      })
    );
  }

  updateSite(siteData: siteModel) {
    return this.httpService.put(cons_baseUrl + "/api/MasterData/Update-site/" + siteData.sitE_DTL_ID, siteData);
  }

  deleteSite(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/MasterData/Delete-site/" + id, { observe: 'response' });
  }

  deleteSiteTestsAssignment(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/Configuration/Delete-siteTests/" + id, { observe: 'response' });
  }

  getAllSite() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllSite");
  }

  getAllRole() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllRoles");
  }

  getSiteById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetSiteById/" + id);
  }

  getLoginTimeId(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/User/GetUserLoginHistoryById/" + id);
  }

  getAllLoginHistory() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllUserLoginHistory/");
  }

  updateLogoutTime(loginData: loginFlModel) {
    return this.httpService.post(cons_baseUrl + "/api/User/LogOut/" + loginData.logiN_FL_ID, loginData);
  }

  getUserIP(ip: string) {
    const appUrl = 'https://api.ipify.org?format=json';
    return this.httpService.get(appUrl);
  }

  GetPageTimeTrackData(id: any) {
    return this.httpService.get(cons_baseUrl + "/api/User/GetPageRecordByUserId/" + id);
  }

  GetAllPageTrackData() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllPageRecord/");
  }

  GetAllAccnPrefix() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllAccnPrefix/");
  }
}
