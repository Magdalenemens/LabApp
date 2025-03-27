import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
//import { clientModel } from 'src/app/models/clientModel';
import { Observable, catchError, throwError } from "rxjs";
import { clientModel } from 'src/app/models/clientModel';
import { anatomicModel, apRepportModel } from 'src/app/models/anatomicModel';
import { pathFindingModel } from 'src/app/models/pathFindingModel';
 


@Injectable({
  providedIn: 'root'
})
export class AnatomicpathologyService { 
  
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) {
   }
    
   updateAPReport(apRepportData:apRepportModel){   
    return this.httpService.patch(cons_baseUrl+"/api/APReport/Update-apReport/"+apRepportData.arF_ID,apRepportData);
   } 

   getAnatomicPathologyById(id:number): Observable<any>{
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAnatomicPathologyById/"+id);
   }

   getAllAnatomicPathology(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllAnatomicPathology");
   }
 
  getRTForAnatomyPathology(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetRTForAnatomyPathology");
   }  

   getRTForAnatomyPathologyById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetRTForAnatomyPathologyById/"+id);
   }

   getAllClinicalFindings(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllClinicalFindings/");
   }

   getClinicalFindingByAccessionNumber(accessionnumber:string){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetClinicalFindingByAccessionNumber/"+accessionnumber);
   }

   addPathFinding(pathAllData: pathFindingModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/Clinical/Insert-pathfinding", pathAllData).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }

   updatePathFinding(pathAllData:pathFindingModel){
    return this.httpService.put(cons_baseUrl+"/api/Clinical/Update-pathfinding/"+pathAllData.clncfndG_ID,pathAllData);
   }

   deletePathAxis(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/Clinical/Delete-clinicalfindingbyid/"+id,{observe : 'response'});
  }

  getAllPathFindingsByAxisType(axisType:string){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllPathFindingsByAxisType/"+axisType);
   }

   getSearchAllPathFindings(search : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/Search-allpathfinding/"+search);
   }   
}
