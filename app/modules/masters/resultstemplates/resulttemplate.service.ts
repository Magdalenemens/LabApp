import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { resulttemplateModel } from 'src/app/models/resulttemplateModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ResultTemplateService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addresultstemplates(resulttemplateList: resulttemplateModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-resultstemplates", resulttemplateList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateresultstemplates(resulttemplateList:resulttemplateModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-resultstemplates/"+resulttemplateList.rS_TMPLT_ID,resulttemplateList);
   }
   deleteresultstemplates(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-resultstemplates/"+id,{observe : 'response'});
  }
  gettAllResultsTemplates(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllResultsTemplates");
   }    
  getResultsTemplatesById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetResultsTemplatesById/"+id);
   }
}
