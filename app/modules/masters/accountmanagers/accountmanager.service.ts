import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { divisionModel } from 'src/app/models/divisionModel';
import { Observable, catchError, throwError } from "rxjs";
import { accountManagernModel } from 'src/app/models/accountManagerModel';


@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addAccountManager(accountManagerList: accountManagernModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-accountmanager", accountManagerList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateAccountManager(accountManagerList:accountManagernModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-accountmanager/"+accountManagerList.salesmeN_ID,accountManagerList);
   }
   deleteAccountManager(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-accountmanager/"+id,{observe : 'response'});
  }
  getAllAccountManager(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllAccountManager");
   }  
    
  getAccountManagerById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAccountManagerById/"+id);
   }
}
