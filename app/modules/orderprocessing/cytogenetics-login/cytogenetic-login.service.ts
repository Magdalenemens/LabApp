import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cons_baseUrl } from 'src/app/common/constant';
import { HttpService } from 'src/app/services/http.service';
import { Observable, catchError, throwError } from "rxjs";
import { cytogeneticLoginModel } from 'src/app/models/cytogeneticLoginModel';
@Injectable({
  providedIn: 'root'
})
export class CytogeneticLoginService {

  constructor(private httpService:HttpService,private http: HttpClient) { }

   getCytogeneticsLogin(cgLoginModel: cytogeneticLoginModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetCytogeneticLogin",cgLoginModel);
   }

   getCytogeneticsLoginAR(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetCytogeneticLoginAR");
   }

   updateCytogeneticsLogin(cgLogin : cytogeneticLoginModel){
    return this.httpService.patch(cons_baseUrl+"/api/Clinical/UpdateCytogeneticLogin/" ,cgLogin);
   }
}
