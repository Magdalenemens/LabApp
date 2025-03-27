import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { userflModel } from 'src/app/models/userflModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

//import { userflModel } from 'src/app/models/userflModel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};


// @Injectable({
//   providedIn: 'root'
// })

// export class UserService {
  // dataChange: any;
  // data: any;
  // getAllIssues() {
  //   throw new Error('Method not implemented.');
  // }

  // constructor(private httpService: HttpService) { }


  // getAllUser() {
  //   return this.httpService.get(cons_baseUrl + "/api/User/GetAllUser");
  // }

  // getUserById(id: number) {
  //   return this.httpService.get(cons_baseUrl + "/api/User/GetUserbyId/" + id);
  // }

  // addUser(userData1: userflModel): Observable<any> {

  //   return this.httpService.post(cons_baseUrl + "/api/User/InsertUserFL", userData1).pipe(
  //     catchError(err => {
  //       console.error('error cought in InsertUser service', err)
  //       return throwError(err);
  //     })
  //   );
  // }

  // updateUser(userData: userflModel) {
  //   //alert("service--"+userData.id);
  //   return this.httpService.put(cons_baseUrl + "/api/User/UpdateUser/" + userData.useR_FL_ID, userData);
  // }

  // deleteUser(id: number) {
  //   return this.httpService.delete(cons_baseUrl + "/api/User/DeleteUser/" + id, { observe: 'response' });
  // }

  // getAllUserJobType() {
  //   return this.httpService.get(cons_baseUrl + "/api/User/GetAllUserJobType");
  // }
  
  // getAllJobType() {
  //   return this.httpService.get(cons_baseUrl + "/api/User/GetAllJobType");
  // }

  // getUserJobTypeById(jobType: string) {
  //   return this.httpService.get(cons_baseUrl + "/api/User/GetUserJobTypeById/" + jobType);
  // }

  // generatePassword(userId: string): Observable<any> {
  //   return this.httpService.post(cons_baseUrl+'/api/User/generate-password', { userId });
  // }
// }
