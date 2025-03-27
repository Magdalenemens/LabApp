// import { Injectable } from '@angular/core';
// import { HttpService } from 'src/app/services/http.service';
// import { cons_baseUrl } from 'src/app/common/constant';
// import { TDModel } from 'src/app/models/tdmodel';
// import { Observable, catchError, throwError } from 'rxjs';
// import { HttpHeaders } from '@angular/common/http';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     Authorization: 'my-auth-token'
//   })
// };

// @Injectable({
//   providedIn: 'root'
// })

// export class AddTestDirectoryService {
//   dataChange: any;
//   data: any;
//   getAllIssues() {
//     throw new Error('Method not implemented.');
//   }

//   constructor(private httpService: HttpService) { }

  // getAllTD() {
  //   return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetTestDirectoryALL");
  // }

  // getTDComboswithTableName(TableName: string, ID: string) {
  //   return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetTestDirectoryCombosByTable/" + TableName + "/" + ID);
  // }

  // insertTestDirectory(userData1: TDModel): Observable<any> {
  //   return this.httpService.post(cons_baseUrl + "/api/TestDirectory/InsertTestDirectory", userData1).pipe(
  //     catchError(err => {
  //       console.error('error caught in InsertUser service', err)
  //       return throwError(err);
  //     })
  //   );
  // }

  // updateTestDirectory(objtdData: TDModel) {
  //   return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateTestDirectory/" + objtdData.tD_ID, objtdData);
  // }

  // deleteTestDirectory(id: number) {
  //   return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteTestDirectory/" + id, { observe: 'response' });
  // }
// }
