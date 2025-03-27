import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { arModel } from 'src/app/models/arModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ArService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addar(arlist: arModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-ar", arlist).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updatear(arlist:arModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-ar/"+arlist.aR_ID,arlist);
   }
   deletear(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-ar/"+id,{observe : 'response'});
  }
  getAllar(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllar");
   }  
    
  getarById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetarById/"+id);
   }
}
