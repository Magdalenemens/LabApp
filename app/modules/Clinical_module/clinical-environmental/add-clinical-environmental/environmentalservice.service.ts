import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { environmentalResultARFModel, evResultStatus, evSearchModel } from 'src/app/models/environemtalResult';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalserviceService {

  constructor(private httpService:HttpService,private http: HttpClient,private _mnService: MnService) { }

   getAllEnvironmentalResult(pSize : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllEnvironmentalResult/" + pSize);
   }

   getEVArf(accn : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllEnvironmentalARFResult/"+accn);
   }

   saveEVResult(evResult: environmentalResultARFModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/InsertEnvironmentalResult", evResult)
   }

   UpdateEVResultInstrument(evResult: environmentalResultARFModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/UpdateEVResultInstrument", evResult)
   }


   updateEVResultStatus(evStatus:evResultStatus){
    return this.httpService.patch(cons_baseUrl+"/api/Clinical/UpdateevResult/"+evStatus.accn,evStatus);
   } 

   resetEVReferenceRange(evStatus:evResultStatus){
    return this.httpService.patch(cons_baseUrl+"/api/Clinical/ResetEVRefRange/"+evStatus.accn,evStatus);
   } 


   getAllEnvironmentalSearch(OrderNo:string){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllEnvironmentalSearch/"+ OrderNo);
   }

   getAllEnvironmentalDetails(evSearch:evSearchModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetEnvironmentalDetails",evSearch);
   }

   getAllmn(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllmn");
   }  

   getAlllInstruments()
   {
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllInstruments");
   }
   
   getAllAR(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllar");
   } 
   
   getSSRSReport(ssrsUrl:string){
    // return this.httpService.get(cons_baseUrl+"/api/reports/ssrs?="+ssrsUrl, { responseType: 'blob' });
    return this.http.get(cons_baseUrl+"/api/reports/reportserver?="+ssrsUrl, {
      responseType: 'blob',
      params: { ssrsUrl }
    });
  
   } 
    
}
