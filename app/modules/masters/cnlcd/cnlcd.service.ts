import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { cnlcdModel } from 'src/app/models/cnlcdModel';
import { Observable, catchError, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CnlcdService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addcnlcd(cnlcdlist: cnlcdModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-cnlcd", cnlcdlist).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updatecnlcd(cnlcdlist:cnlcdModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-cnlcd/"+cnlcdlist.cnlcD_ID,cnlcdlist);
   }
   deletecnlcd(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-cnlcd/"+id,{observe : 'response'});
  }
  getAllcnlcd(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllcnlcd");
   }  
    
  getcnlcdById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetcnlcdById/"+id);
   }
}
