import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant'; 

@Injectable({
  providedIn: 'root'
})
export class PreAnalyticalReceivingService {

  //private baseUrl: string = "https://localhost:7084/"
  private baseUrl: string = cons_baseUrl + '/';

  constructor(private http: HttpClient) { }

  
  GetOrdersDetailsByAccn(ACCN: any, STS:any) {
    return this.http.get<any>(`${this.baseUrl}api/PreAnalyticalReceiving/GetOrdersDetailsByAccn/${ACCN}/${STS}`);
  }

  UpdatePreAnalyticalReceiving(OrdObj: any[], ACCN: any, REQ_CODE: any, SECT: any, ATRID: any, ORD_NO: any, SITE_NO: any, U_ID: any) {
    return this.http.put<any>(`${this.baseUrl}api/PreAnalyticalReceiving/UpdatePreAnalyticalReceiving/${ACCN}/${REQ_CODE}/${SECT}/${ATRID}/${ORD_NO}/${SITE_NO}/${U_ID}`, OrdObj);
  }

}
