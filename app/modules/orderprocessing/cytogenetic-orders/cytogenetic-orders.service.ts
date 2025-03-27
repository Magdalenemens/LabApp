import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';
import { HttpService } from 'src/app/services/http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { cgListMultiInvoicePrintModel, cgListPrintModel, cytogeneticOrderATR, cytogeneticOrderModel } from 'src/app/models/cytogenticOrderModel';


@Injectable({
  providedIn: 'root'
})
export class CytogeneticOrdersService {

  private baseUrl: string = cons_baseUrl + '/';

  constructor(private http: HttpClient,private httpService:HttpService) { }

  GetAllCytogeneticOrder(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllCytogeneticOrder");
   }

   getAllEVOrderATR(evOrder : cytogeneticOrderATR){
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

   
   InsertCGOrder(evOrderModel : cytogeneticOrderModel){
    return this.http.post<any>(cons_baseUrl+"/api/Order/InsertCGOrder/" ,evOrderModel);
   }

   GetAllCGTD(TCode:string){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllCGTD/"+TCode);
   }

   InsertCGATR(evATRModel: cytogeneticOrderATR[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Order/InsertCGOrderATR", evATRModel)
   }

   
   GetAllEVPatientSearch(){
    return this.httpService.get(cons_baseUrl+"/api/Order/GetAllEVPatientSearch");
   }


   GetEVPrint(evPrint: cgListPrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetEVPrint",evPrint);
  }
  
  GetEVMultipleInvoicePrint(evPrint: cgListMultiInvoicePrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetEVMultiInvoicePrint",evPrint);
  }
  
  GetEVMultipleInvoice(evPrint: cgListMultiInvoicePrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/GetAllMultiInvoice",evPrint);
  }
  

  UpdateInvoice(evInvoice: cgListPrintModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Order/UpdateInvoice",evInvoice);
  }

  getCancelDescription() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllCNLCD`);
  }

  Update_ATR(ATRID: any, R_STS: any, CNLD: any, Notes: any, SITE_NO:any, U_ID:any,ORD_NO:any, SEC:any,REQ_CODE:any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/CancelActiveTestRequest/${ATRID}/${R_STS}/${CNLD}/${Notes}/${SITE_NO}/${U_ID}/${ORD_NO}/${SEC}/${REQ_CODE}`, ATRID);//Order/Update_ATR?ATRID=${ATRID}&RS=${RS}&CNLD=${CNLD}&Notes=${Notes}
  }

  GetSharedTableNat() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetSharedTableNat`);
  }

  GetSpecimensTypes() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllSpecimentypes`);
  }

  GetAllDoctorFile() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllDoctorFile`);//Doctor/GET_DOC_FL
  }

  GetPR(PRObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/PatientRegistration/GetPatientRegistrationByPATID/${PRObj}`);//PR
  }
 
  getCytogeneticsLoginAR(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetCytogeneticLoginAR");
   }

}
