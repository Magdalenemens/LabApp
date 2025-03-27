import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { evSearchModel } from 'src/app/models/environemtalResult';
import { environmentalOrderModel, environmentOrderATR, evListMultiInvoicePrintModel, evListPrintModel } from 'src/app/models/environmentalOrderModel';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalorderService {

  private baseUrl: string = cons_baseUrl + '/';

  constructor(private http: HttpClient,private httpService:HttpService) { }

  getAllEnvironmentOrder(pSize : any){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllEnvironmentalOrder/" + pSize);
   }

   getAllEVOrderATR(evOrder : environmentOrderATR){
    return this.http.post<any>(cons_baseUrl+"/api/Order/GetForEnvironmentalOrderATR",evOrder);
   }

   getAllClients(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllClients");
   }

   getPatientID(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetPatientId");
   }

   GetAllEVSample(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllEVSample");
   }

   
   InsertEVOrder(evOrderModel : environmentalOrderModel){
    return this.http.post<any>(cons_baseUrl+"/api/Order/InsertEVOrder/" ,evOrderModel);
   }

   GetAllEVTD(TCode:string){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllEVTD/"+TCode);
   } 

   insertEnvironmentalATR(evATRModel: environmentOrderATR[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Order/InsertEnvironmentalOrderATR", evATRModel)
   }

   
   GetAllEVPatientSearch(OrderNo:string){   
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllEVPatientSearch/"+ OrderNo);
   }


   GetEVPrint(evPrint: evListPrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetEVPrint",evPrint);
  }
  
  GetEVMultipleInvoicePrint(evPrint: evListMultiInvoicePrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetEVMultiInvoicePrint",evPrint);
  }
  
  GetEVMultipleInvoice(evPrint: evListMultiInvoicePrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetAllMultiInvoice",evPrint);
  }
  

  UpdateInvoice(evInvoice: evListPrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/UpdateInvoice",evInvoice);
  }

  getCancelDescription() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllCNLCD`);
  }

  Update_ATR(ATRID: any, R_STS: any, CNLD: any, Notes: any, SITE_NO:any, U_ID:any,ORD_NO:any, SEC:any,REQ_CODE:any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/CancelActiveTestRequest/${ATRID}/${R_STS}/${CNLD}/${Notes}/${SITE_NO}/${U_ID}/${ORD_NO}/${SEC}/${REQ_CODE}`, ATRID);//Order/Update_ATR?ATRID=${ATRID}&RS=${RS}&CNLD=${CNLD}&Notes=${Notes}
  }
  
  getBarcode(accn: string) {
    return this.http.get<any[]>(cons_baseUrl + "/api/Barcode/GetBarcode/"+accn);
  }

  getSignUser(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetSignedUser");
   }
   getEnvironmentalOrderList(pendingDays:number,isPending:boolean){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetEnvironmentalOrderList/"+pendingDays+"/"+isPending);
   }
   getEVOrderPatientDetails(evSearch:evSearchModel){
    return this.http.post<any>(cons_baseUrl+"/api/Order/GetEVOrderPatientDetails",evSearch);
   }
  
   getEVOrderOTP(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetEVOTP");
   }
}
