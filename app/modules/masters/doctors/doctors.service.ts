import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { userflModel } from 'src/app/models/userflModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { doctorflModel } from 'src/app/models/doctorflModel';

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

export class DoctorService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  addUser(docData: doctorflModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/MasterData/Insert-doctor", docData).pipe(
      catchError(err => {
        console.error('error cought in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateUser(docData: doctorflModel) {
    //alert("service--"+userData.id);
    return this.httpService.put(cons_baseUrl + "/api/MasterData/Update-doctor/" + docData.doC_FL_ID, docData);
  }

  deleteUser(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/MasterData/Delete-doctor/" + id, { observe: 'response' });
  }

  getAllDoctors() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllDoctorFile");
  }

  getDoctorById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllDoctorFile/" + id);
  }
}
