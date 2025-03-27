import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { mnModel } from 'src/app/models/mnModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MnService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addmn(mnlist: mnModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-mn", mnlist).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updatemn(mnlist:mnModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-mn/"+mnlist.mN_ID,mnlist);
   }
   deletemn(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-mn/"+id,{observe : 'response'});
  }
  getAllmn(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllmn");
   }  
    
  getmnById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetmnById/"+id);
   }
}
