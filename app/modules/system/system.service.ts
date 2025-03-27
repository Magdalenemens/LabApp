import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { divisionModel } from 'src/app/models/divisionModel';
import { Observable, catchError, throwError } from "rxjs";
import { sysconfigModel } from 'src/app/models/sysconfigModel';


@Injectable({
  providedIn: 'root'
})
export class SytemService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  addSystemConfig(configList: sysconfigModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/Configuration/Insert-systemconfig", configList).pipe(
      catchError(err => {
        console.error('error cought in service', err)
        return throwError(err);
      })
    );
  }
  updateSystemConfig(divisionlist: divisionModel) {
    return this.httpService.put(cons_baseUrl + "/api/Configuration/Update-systemconfig/" + divisionlist.laB_DIV_ID, divisionlist);
  }
  deleteSystemConfig(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/Configuration/Delete-systemconfig/" + id, { observe: 'response' });
  }
  getAllSystemConfig() {
    return this.httpService.get(cons_baseUrl + "/api/Configuration/GetAllSystemConfig");
  }

  getSystemConfigById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/Configuration/GetSystemConfigById/" + id);
  }

  getOrderRoles() {
    return this.httpService.get(cons_baseUrl + "/api/Permission/GetOrderRoles");
  }


  getOrderPermissions(roleId: number, subModule: string) {
    return this.httpService.get(cons_baseUrl + "/api/Permission/GetOrderPermissions?roleId=" + roleId + "&subModule=" + subModule);
  }

  updateOrderPermission(obj: any) {
    return this.httpService.put(cons_baseUrl + "/api/Permission/Update-OrderPermission", obj);
  }

  getResultPermissions(roleId: number, subModule: string) {
    return this.httpService.get(cons_baseUrl + "/api/Permission/GetResultPermissions?roleId=" + roleId + "&subModule=" + subModule);
  }

  updateResultPermission(obj: any) {
    return this.httpService.put(cons_baseUrl + "/api/Permission/Update-ResultPermission", obj);
  }

  getMainAccessPermissions(roleId: number) {
    return this.httpService.get(cons_baseUrl + "/api/Permission/GetMainAccessPermissions?roleId=" + roleId);
  }

  updateMainAccessResultPermission(obj: any) {
    return this.httpService.put(cons_baseUrl + "/api/Permission/Update-MainAccessPermission", obj);
  }
  updateAllPermission(obj: any) {
    return this.httpService.put(cons_baseUrl + "/api/Permission/Update-AllPermission", obj);
  }
}
