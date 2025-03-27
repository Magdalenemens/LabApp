import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';
import { TdRefRngModel } from 'src/app/models/tdmodel';
import { HttpService } from 'src/app/services/http.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReferenceRangesService {

  constructor(private httpService:HttpService,private http: HttpClient) { }

  getTdDiv(){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllTDDiv");
   }
 
   getSectByDiv(Id:number){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllSectByDiv/"+Id);
   }
 
   
   getAllTestDirectiveByDiv(Id:number){
     return this.httpService.get(cons_baseUrl+"/api/TestDirectory/getAllTestDirectiveByDiv/"+Id);
    }
 
    getTdReferenceRange(){
     return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetAllTDReferenceRange");
    }
  
    saveReferenceRange(tdRefRange: TdRefRngModel[]) :Observable<any>{
     return this.http.post<any>(cons_baseUrl+"/api/TestDirectory/Insert-ReferenceRange", tdRefRange)
    }
 
    getBarcode(accn: string) {
     return this.http.get<any[]>(cons_baseUrl + "/api/TestDirectory/GetBarcode/"+accn);
   }
}
