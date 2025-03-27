import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { Observable, catchError, throwError } from "rxjs";
import { clientModel } from 'src/app/models/clientModel';
import { mbReportModel } from 'src/app/models/microbiologyModel';
import { mbIsolModel } from 'src/app/models/mbIsolModel';
import { HttpClient } from '@angular/common/http';
import { mbSensitivityModel } from 'src/app/models/mbSensitivityModel';
import { mbListQRModel, mbListSearchModel } from 'src/app/models/microbiologyListModel';
import { MnService } from 'src/app/modules/masters/mn/mn.service';

@Injectable({
  providedIn: 'root'
})
export class MicroBiologyService {
  constructor(private httpService:HttpService,private http: HttpClient,private _mnService: MnService) { }

  
  updateMBReport(mbReportData:mbReportModel){
    return this.httpService.patch(cons_baseUrl+"/api/MBReport/Update-mbReport/"+mbReportData.arF_ID,mbReportData);
   } 

   getMicroBiologyById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetMicroBiologyById/"+id);
   }

   getAllMicroBiology(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllMicroBiology");
   }

   getAllMicroBiologySearch(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetAllMicroBiologySearch");
   }
 
  getRTForMicroBiology(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetRTForMicroBiology");
   }  

   getRTForMicroBiologyById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetRTForMicroBiologyById/"+id);
   }

   getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  getMicroBiologyIsol(id:number){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetMicroBiologyISolByArfId/"+id);
   }

   getAllIsol(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologyAllISol");
   }

   getSearchIsol(search : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologySearchISol/"+search);
   }   

   getMBSensitivityAR(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologyARSensitivity/");
   }   

   getAllSensitivity(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologyAllSensitivity");
   }

   getSearchSensitivity(search : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologySearchSensitivity/"+search);
   }

   getAllGTDSensitivity(){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologyAllGTDSensitivity");
   }

   saveMicrobiologyIsol(mBIsolModel: mbIsolModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/Insert-MicroBiologyISol", mBIsolModel)
   }

   saveMicrobiologySensitivity(mBSensitivityModel: mbSensitivityModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/Insert-MicroBiologySensitivity", mBSensitivityModel)
   }

   getAllSensitivityData(id : any){
    return this.httpService.get(cons_baseUrl+"/api/Clinical/GetForMicroBiologyAllSensitivityData/"+id);
   }

   getAllMicroBiologyList(mbListSearch: mbListSearchModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetAllMicroBiologyList",mbListSearch);
   }

   GetCient(clientObj: any) {
    return this.http.get<any>(cons_baseUrl + "/api/MasterData/GetClientByCN/${clientObj}");
  }

  getBarcode(accn: string) {
    return this.http.get<any[]>(cons_baseUrl + "/api/Barcode/GetBarcode/"+accn);
  }

  getQRcode(mbListQR: mbListQRModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Barcode/GetQRcode",mbListQR);
  }

  getCodePDF(mbListQR: mbListQRModel) {
    return this.http.post<any>(cons_baseUrl + "/api/Barcode/GetCodePDF",mbListQR);
  }
  
  getAllMicroBiologyListQRCode(mbListQRSearch: mbListSearchModel){
    return this.http.post<any>(cons_baseUrl+"/api/Clinical/GetAllMicroBiologyListQRCode",mbListQRSearch);
   }
}
