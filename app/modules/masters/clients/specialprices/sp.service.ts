import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { Observable, catchError, throwError } from "rxjs";
import { specialpricesModel } from 'src/app/models/specialpricesModel';
@Injectable({
  providedIn: 'root'
})
export class SpService {  

  constructor(private httpService:HttpService) {
   }

   addSpecialPrices(specialpriceList: specialpricesModel[]) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-specialprices", specialpriceList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }

   addSpecialPriceFromSourceToDestinations(specialpriceList: specialpricesModel[]) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-SpecialPricesFromSourceToDestination", specialpriceList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }

   getAllTests(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllTests");
   } 

   GetSpecialpricesByClient(FromCN :string,ToCN:string){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetSpecialpricesByClient/"+FromCN+"/"+ToCN);
   }

   GetSpecialPricesById(id: number,code:string){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetSpecialPricesByCode/"+id+"?code="+code);
   }
}
