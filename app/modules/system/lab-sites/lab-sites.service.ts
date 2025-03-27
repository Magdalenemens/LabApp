import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { Observable, catchError, throwError } from "rxjs";
import { siteModel, siteTestsAssignmentModel } from 'src/app/models/siteModel';
import { loginFlModel } from 'src/app/models/loginModel';

@Injectable({
  providedIn: 'root'
})
export class LabSiteService {
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

  getAllSite() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllSite");
  }

  getSiteById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetSiteById/" + id);
  }

  addSiteTestsAssignment(addSiteTestsData: siteTestsAssignmentModel[]): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/Configuration/Insert-sitetests-assignment", addSiteTestsData).pipe(
      catchError(err => {
        console.error('Error caught in service', err);
        return throwError(err);
      })
    );
  }

  getAllSiteTests() {
    return this.httpService.get(cons_baseUrl + "/api/Configuration/GetAllSiteTestsAssignment");
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

  getTestForDivision(Id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllSectByDiv/" + Id);
  }

  getAllTestsForDivision(Id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/getAllTestDirectiveByDiv/" + Id);
  }

  getAllTestsByDivision(Id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllTestsByDivision/" + Id);
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

  getAllCompany() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllCompany/");
  }
}
