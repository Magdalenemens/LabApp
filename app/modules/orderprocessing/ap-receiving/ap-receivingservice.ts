import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cons_baseUrl } from 'src/app/common/constant';
import { HttpService } from 'src/app/services/http.service';
import { Observable, catchError, throwError } from "rxjs";
import { cytogeneticLoginModel } from 'src/app/models/cytogeneticLoginModel';
import { apreceivingmodel } from 'src/app/models/apreceivingmodel';
 @Injectable({
  providedIn: 'root'
})
export class AnatomicPathologyReceivingService {

  constructor(private httpService:HttpService,private http: HttpClient) { }

   updateAPReceiving(apReceivingData: apreceivingmodel){
    return this.httpService.post(cons_baseUrl+"/api/Clinical/UpdateAPReceiving/"+apReceivingData.aP_CASES_ID,apReceivingData);
   }

   getAllAPReceiving(){
    return this.http.get<any>(cons_baseUrl+"/api/Clinical/GetAllAPReceiving");
   }

   getAAPReceivingAR(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/getAAPReceivingAR");
   } 

   getAPReceivingByAccessionNumber(accessionnumber:string){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAPReceivingByAccessionNumber/"+accessionnumber);
   }   
}
