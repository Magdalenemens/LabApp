import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { mniModel } from 'src/app/models/mniModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class mniService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addmni(mnilist: mniModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-mni", mnilist).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updatemni(mnilist:mniModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-mni/"+mnilist.mnI_ID,mnilist);
   }
   deletemni(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-mni/"+id,{observe : 'response'});
  }
  getAllmni(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllmni");
   }  
    
  getmniById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetmniById/"+id);
   }
}
