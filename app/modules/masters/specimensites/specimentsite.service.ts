import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { specimentsiteModel } from 'src/app/models/specimentsiteModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SpecimenSiteService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addSPSite(specimensiteList: specimentsiteModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-specimenSite", specimensiteList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateSPSite(specimensiteList:specimentsiteModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-specimenSite/"+specimensiteList.sP_SITE_ID,specimensiteList);
   }
   deleteSPSite(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-specimenSite/"+id,{observe : 'response'});
  }
  getAllSPSite(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllSpecimenSite");
   }  
    
  getSPSiteById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetSpecimenSiteById/"+id);
   }
}
