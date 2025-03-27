import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class BillsGenerationService {

  constructor(private httpService:HttpService,private http: HttpClient) { }


  InvokeBilling() :Observable<any>{
    return this.httpService.get(cons_baseUrl+"/api/Account/InvokeBilling");
   }

   DeleteBilling() :Observable<any>{
    return this.httpService.get(cons_baseUrl+"/api/Account/DeleteBilling");
   }


   GetBillingData(cn:string) :Observable<any>{
    return this.httpService.get(cons_baseUrl+"/api/Account/GetBillingData/"+cn);
   }
   
   GetClientNumberData() :Observable<any>{
    return this.httpService.get(cons_baseUrl+"/api/Account/GetClientNumber");
   }


}
