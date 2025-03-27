import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';
import { cgListSearchModel, cgReportModel, txtNameModel } from 'src/app/models/cytogeneticModel';
import { HttpService } from 'src/app/services/http.service';
import { Observable, catchError, throwError } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CytogeneticsService {

  constructor(private httpService:HttpService,private http: HttpClient) 
  {
  }

  getAllCytogenetics(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllCytogenetics");
   }
   
  updateCGReport(cgReportData:cgReportModel){
    return this.httpService.patch(cons_baseUrl+"/api/MBReport/Update-cgReport/"+ cgReportData.arF_ID,cgReportData);
   } 

   getAllRTest(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllRTest");
   }

   getAlltxtName(txtName: txtNameModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetAllTxtNms",txtName);
   }

   saveTestResult(txtResult: txtNameModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/Insert-Cytogenetics_Txt_Res", txtResult)
   }

   getAllCytogeneticsList(cgListSearch: cgListSearchModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetAllCytogeneticsList",cgListSearch);
   }

   GetCient(clientObj: any) {
    return this.http.get<any>(cons_baseUrl + "/api/MasterData/GetClientByCN/${clientObj}");
  }

  getCytogeneticById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetCytogeneticById/"+id);
   }

   GetOrderTrackingByOrdNo(ORD_NO: any,REQ_CODE: any) {
     let baseUrl: string = cons_baseUrl + '/';
    return this.http.get<any>(`${baseUrl}api/Order/GetOrderTrackingByOrdNo/${ORD_NO}/${REQ_CODE}`);
  }
  insertClinicalImage(obj: any): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/Clinical/Insert-ClinicalImage", obj);
  }

  getClinicalImage(obj: any): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/Clinical/GetAllClinicalImages", obj);
  }

  
  deleteCytogeneticById(id:number){
    return this.httpService.delete(cons_baseUrl+"/api/Clinical/Delete-clinicalImagebyid/"+id);
   }

}
