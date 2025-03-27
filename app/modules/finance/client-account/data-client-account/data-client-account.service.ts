import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
//import { clientModel } from 'src/app/models/clientModel';
import { Observable, catchError, throwError } from "rxjs";
import { clientModel } from 'src/app/models/clientModel';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';
import { pathFindingModel } from 'src/app/models/pathFindingModel';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { EncryptionHelper } from 'src/app/interceptors/encryption-helper';



@Injectable({
  providedIn: 'root'
})
export class ClientAccountDataEntryService {


  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService, private authService: AuthService) {
  }

  getClientAccountDataEntryById(id: number): Observable<any> {
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountDataEntryById/" + id);
  }

  getClientAccountById(id: number): Observable<any> {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountById/" + id + "/" + companyNo);
  }

  insertClientAccountEntry(obj: any): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/ClientAccount/Insert-clientaccount", obj);
  }
  updateClientAccountEntry(obj: any): Observable<any> {
    return this.httpService.put(cons_baseUrl + "/api/ClientAccount/Update-clientaccount/" + obj.clntacnT_ID, obj);
  }

  getClientAccountList(): Observable<any> {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccount?companyNo=" + companyNo);
  }

  getClientAccountStatement(id: number, fromDate: any, todate: any): Observable<any> {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountStatement?Id=" + id + "&FromDate=" + fromDate + "&ToDate=" + todate + "&CompanyNo=" + companyNo);
  }

  getClientAccountDataEntry(id) {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountDataEntry/" + id + "/" + companyNo);
  }
  getClientAccountCrossCheckList(displaySince: number, isPositive: boolean): Observable<any> {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountCrossCheck?DisplayMonth=" + displaySince + "&IsPositive=" + isPositive + "&CompanyNo=" + companyNo);
  }
  getClientAccountCurrentStatusList(): Observable<any> {
    var companyNo = EncryptionHelper.decrypt(this.authService.getCompanyNo());
    return this.httpService.get(cons_baseUrl + "/api/ClientAccount/GetClientAccountCurrentStatus?companyNo=" + companyNo);
  }

}
