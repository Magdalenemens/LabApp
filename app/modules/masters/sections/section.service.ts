import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { sectionModel } from 'src/app/models/sectionModel';
import { Observable, catchError, throwError } from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class SectionService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addSection(sectionlist: sectionModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-section", sectionlist).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateSection(sectionlist:sectionModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-section/"+sectionlist.laB_SECT_ID,sectionlist);
   }
   deleteSection(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-Section/"+id,{observe : 'response'});
  }
  getAllSection(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllSection");
   }  
    
  getDivisionById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetSectionById/"+id);
   }
}
