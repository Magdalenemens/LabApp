import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { TdRefRngModel } from 'src/app/models/tdmodel';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class NumericRefernceRangeService {

  constructor(private httpService:HttpService,private http: HttpClient) { }

  getAllDivision(){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllTDDiv");
   }
 
   getSectionByDivision(Id:number){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllSectByDiv/"+Id);
   }
 
   
   getAllTestDirectiveByDivision(Id:number){
     return this.httpService.get(cons_baseUrl+"/api/TestDirectory/getAllTestDirectiveByDiv/"+Id);
    }
 
    getNumericReferenceRange(){
     return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllTDReferenceRange");
    }
  
    saveNumericReferenceRange(tdRefRange: TdRefRngModel[]) :Observable<any>{
     return this.http.post<any>(cons_baseUrl+"/api/TestDirectory/Insert-ReferenceRange", tdRefRange)
    }
 
}
