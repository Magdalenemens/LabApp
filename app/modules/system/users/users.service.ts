import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { userflModel } from 'src/app/models/userflModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { userSiteAccesslModel } from 'src/app/models/userSiteAccesslModel';
import { changePasswordRequestModel } from 'src/app/models/loginModel';

//import { userflModel } from 'src/app/models/userflModel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})

export class UserService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }


  getAllUser() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllUser");
  }

  getUserById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/User/GetUserbyId/" + id);
  }

  getUserByUserId(userId: string) {
    return this.httpService.get(cons_baseUrl + "/api/User/GetUserByUserId/" + userId);
  }
  
  addUser(userData1: userflModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/User/InsertUserFL", userData1).pipe(
      catchError(err => {
        console.error('error cought in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateUser(userData: userflModel) {
    //alert("service--"+userData.id);
    return this.httpService.put(cons_baseUrl + "/api/User/UpdateUser/" + userData.useR_FL_ID, userData);
  }

  deleteUser(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/User/DeleteUser/" + id, { observe: 'response' });
  }

  // registerUserSites(userSitesAccessList: userSiteAccesslModel[]): Observable<any> {
  //   return this.httpService.post(cons_baseUrl + "/api/Site/Register-UserSites", userSitesAccessList).pipe(
  //     catchError(err => {
  //       console.error('error cought in InsertUser service', err)
  //       return throwError(err);
  //     })
  //   );
  // }

  registerUserSites(userSitesAccessList: userSiteAccesslModel[]) {
    //alert("service--"+userData.id);
    return this.httpService.put(cons_baseUrl + "/api/Site/Register-UserSites/", userSitesAccessList);
  }

  getSitesByUserId(userId: string) {
    return this.httpService.get(cons_baseUrl + "/api/Site/GetSitesByUserId/" + userId);
  }

  getSiteDetailsBySiteNo(siteNo: string) {
    return this.httpService.get(cons_baseUrl + "/api/Site/GetSiteDetailBySiteNo/" + siteNo);
  }
  
  changePassword(passwordChangeModel:changePasswordRequestModel){
    return this.httpService.post(cons_baseUrl + "/api/User/ChangePassword/", passwordChangeModel);
  }

  findAllSites(search: string) {
    return this.httpService.get(cons_baseUrl + "/api/Site/FindAllSites/" + search);
  }


  deleteUserSite(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/Site/Delete-UserSite/" + id, { observe: 'response' });
  }

  getAllUserJobType() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllUserJobType");
  }

  getAllJobType() {
    return this.httpService.get(cons_baseUrl + "/api/User/GetAllJobType");
  }

  getUserJobTypeById(jobType: string) {
    return this.httpService.get(cons_baseUrl + "/api/User/GetUserJobTypeById/" + jobType);
  }

  getModuleAccessDetailsByUserId(userId: string) {
    return this.httpService.get(cons_baseUrl + "/api/UserAccess/GetModuleAccessDetailsByUserId/" + userId);
  }
  // generatePassword(userId: string): Observable<any> {
  //   return this.httpService.post(cons_baseUrl+'/api/User/generate-password', { userId });
  // }
}
