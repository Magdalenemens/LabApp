import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { specimentsiteModel } from 'src/app/models/specimentsiteModel';
import { Observable, catchError, throwError } from "rxjs";
import { specimentypeModel } from 'src/app/models/specimentypeModel';
import { evsampletestModel } from 'src/app/models/evsampletestModel';


@Injectable({
  providedIn: 'root'
})
export class EVSampleTestService {
  
  constructor(private httpService:HttpService) { }
  
  addEVSampleTest(evsampletestList: evsampletestModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-evsampletest", evsampletestList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateEVSampleTest(evsampletestList:evsampletestModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-evsampletest/"+evsampletestList.eV_SMPLS_ID,evsampletestList);
   }
   deleteEVSampleTest(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/delete-evsampletest/"+id,{observe : 'response'});
  }
  getAllEVSampleTest(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllEVSampletest");
   }  
  
}
