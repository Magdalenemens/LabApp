import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { specimentsiteModel } from 'src/app/models/specimentsiteModel';
import { Observable, catchError, throwError } from "rxjs";
import { specimentypeModel } from 'src/app/models/specimentypeModel';


@Injectable({
  providedIn: 'root'
})
export class SpecimenTypeService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addSpecimenType(specimentypeList: specimentypeModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-specimentypes", specimentypeList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateSpecimenType(specimentypeList:specimentypeModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-specimentypes/"+specimentypeList.sP_TYPE_ID,specimentypeList);
   }
   deleteSpecimenTypee(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/delete-specimentypes/"+id,{observe : 'response'});
  }
  getAllSpecimenType(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllSpecimentypes");
   }  
    
  getSpecimenType(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetSpecimentypesById/"+id);
   }
}
