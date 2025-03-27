import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { divisionModel } from 'src/app/models/divisionModel';
import { Observable, catchError, throwError } from "rxjs";
import { driverModel } from 'src/app/models/driverModel';


@Injectable({
  providedIn: 'root'
})
export class DriverService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addDriver(driverList: driverModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-driver", driverList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateDriver(driverList:driverModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-driver/"+driverList.drvrS_ID,driverList);
   }
   deleteDriver(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-driver/"+id,{observe : 'response'});
  }
  getAllDriver(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/getAllDriver");
   }  
    
  getDriverById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/getDriverById/"+id);
   }
}
