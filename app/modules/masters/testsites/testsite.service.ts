import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { testsiteModel } from 'src/app/models/testsiteModel';
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestSiteService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addTestSite(testsiteList: testsiteModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-TestSite", testsiteList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateTestSite(testsiteList:testsiteModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-TestSite/"+testsiteList.laB_TS_ID,testsiteList);
   }
   deleteTestSite(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-TestSite/"+id,{observe : 'response'});
  }
  getAllTestSite(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllTestSite");
   }  
    
  getTestSiteById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetTestSiteById/"+id);
   }
}
