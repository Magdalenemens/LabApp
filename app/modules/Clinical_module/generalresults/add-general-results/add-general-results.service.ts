import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';

@Injectable({
  providedIn: 'root'
})
export class GeneralResulService {

  //private baseUrl: string = "https://localhost:7084/"
  private baseUrl: string = cons_baseUrl + '/';

  constructor(private http: HttpClient) { }


  GetAllAccnActiveResultsFile() {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetAllAccnActiveResultsFile`);
  }

  GetAccnActiveResultsFileList(ACCN: any) {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetAccnActiveResultsFileList/${ACCN}`);
  }

  UpdateActiveResultsFileGenLab(OrdObj: any[], ACCN: any, REQ_CODE: any, LHF: any, ARF_ID: any, ORD_NO: any, RESULT: any) {
    return this.http.put<any>(`${this.baseUrl}api/Clinical/UpdateActiveResultsFileGenLab/${ACCN}/${REQ_CODE}/${LHF}/${ARF_ID}/${ORD_NO}/${RESULT}`, OrdObj);
  }
  UpdateNotesActiveResultsFileGenLab(ARF_ID: any, ACCN: any, NOTES: any | null) {
    return this.http.put<any>(`${this.baseUrl}api/Clinical/UpdateNotesActiveResultsFileGenLab/${ARF_ID}/${ACCN}/${NOTES}`, '');
  }
  GetOrderDetailsByPatIdOrdNo(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetOrdersTransactionsDetailsByParams/${PAT_ID}/${ORD_NO}`);
  }

  GetAlphaResponsesByCD(CD: any) {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetAlphaResponsesByCD/${CD}`);
  }
  GetAlphaValuesByCode(TCODE: any, RESVAL: any) {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetAlphaValuesByCode/${TCODE}/${RESVAL}`);
  }
  GetInterpretiveValuesByCode(TCODE: any, SEX: any, rsultvalue: any) {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetInterpretiveValuesByCode/${TCODE}/${SEX}/${rsultvalue}`);
  }

  GetAccnActiveResultsFileInterp(ACCN: any, TOCDE: any) {
    return this.http.get<any>(`${this.baseUrl}api/Clinical/GetAccnActiveResultsFileInterp/${ACCN}/${TOCDE}`);
  }

  InsertResultModified(resultModifiedModel: any) {
    return this.http.post<any>(`${this.baseUrl}api/Clinical/InsertResultModified/`, resultModifiedModel);
  }
  UpdateResultModified(PAT_ID: any, ACCN: any, TCODE: any, CRESULT: any, CV_ID: any, RESULT: any, V_ID: any) {
    return this.http.put<any>(`${this.baseUrl}api/Clinical/UpdateResultModified/${PAT_ID}/${ACCN}/${TCODE}/${CRESULT}/${CV_ID}/${RESULT}/${V_ID}`, '');
  }
}
