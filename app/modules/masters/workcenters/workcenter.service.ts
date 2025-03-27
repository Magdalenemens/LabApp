import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { workcenterModel } from 'src/app/models/workcenterModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addWorkCenter(workcenterList: workcenterModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-WorkCenter", workcenterList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateWorkCenter(workcenterList:workcenterModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-WorkCenter/"+workcenterList.laB_WC_ID,workcenterList);
   }
   deleteWorkCenter(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-WorkCenter/"+id,{observe : 'response'});
  }
  getAllWorkCenter(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllWorkCenter");
   }  
    
  getWorkCenterById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetWorkCenterById/"+id);
   }
}
