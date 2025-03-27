import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  //private baseUrl: string = "https://localhost:7084/"
  private baseUrl: string = cons_baseUrl + '/';

  constructor(private http: HttpClient) { }

  signup(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}api/PatientRegistration/UpdatePatientRegistration`, userObj);//UserAccount/RegisterUserAccount
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}UserAccount/authenticate`, loginObj);//to be remove
  }

  GetPR(PRObj: any) {
    return this.http.post<any>(`${this.baseUrl}api/PatientRegistration/GetPatientRegistrationByPATID`, PRObj);//PR
  }

  GetPRSearch(PRObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/PatientRegistration/GetPatientRegistrationByPATID/${PRObj}`);//PRSearch
  }


  GetSalesmen () {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllAccountManager`);
  }

  GetOrderType() {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetAllOrderType`);
  }

  GetCLNT_FL(CLNT_FLObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetClientByCN/${CLNT_FLObj}` );//GET_CLNT_FL
  }
  GetDOC_FL(DOC_FLObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetDoctorFileByDrNo/${DOC_FLObj}`);//Doctor/GET_DOC_FL
  }
  GetLOCATION(LOCATIONObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetLocationsFileByLoc/${LOCATIONObj}`);//Location/GET_LOCATION
  }

  /*Update and create new PR informations*/
  PutPR(PRObj: any) {
    return this.http.put<any>(`${this.baseUrl}api/PatientRegistration/UpdatePatientRegistration`, PRObj);//PR/UpdatePR
  }

  /*Serach for the Test Code*/
  GetTD(TCODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetTestDirectoryByTCode?TCODE/${TCODE}`);//TD/GET_TD?TCODE=${TCODE}
  }
  GetGT(REQ_CODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/GroupTests/GetGroupTestsByReqCode/${REQ_CODE}`);//GT/GET_GT?REQ_CODE=${REQ_CODE}
  }
  GET_GTD(GTNO: any, REQ_CODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/GroupTests/GetGroupTestsDetailedByParams/${GTNO}/${REQ_CODE}`);//GT/GET_GTD?GTNO=${GTNO}&REQ_CODE=${REQ_CODE}
  }

  GET_V_TD_GTD(REQ_CODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetGroupTestsDetailedandTestDirectory/${REQ_CODE}`);//TD/GET_V_TD_GTD?REQ_CODE=${REQ_CODE}
  }
  GET_V_TD_GTD_TCODE(REQ_CODE: any, TCODE :any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetGroupTestsDetailedandTestDirectoryParams/${REQ_CODE}/${TCODE}`);//TD/GET_V_TD_GTD_TCODE?REQ_CODE=${REQ_CODE}&TCODE=${TCODE}
  }

  //Get Price from CLNT_SP
  //GetPriceClinetSP(CLNT_SPObj: any) {
  GetPriceClinetSP(cn: any,  tcode:any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetSpecialPricesByParams/${cn}/${tcode}`);//Client/GET_CLNT_SP`, CLNT_SPObj
  }

  /*Generate New Order No after the ORD Transaction Inserted*/
  GET_NEW_ORD_NO() {
    return this.http.get<any>(`${this.baseUrl}Order/GET_NEW_ORD_NO`);
  }


  /*Search for the Newly created order after the order was created by the end user*/
  GET_ORD_TRNS(PAT_ID: any, ORD_NO:any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_ORD_TRNS?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }
  GET_v_ORD_TRANS(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_v_ORD_TRANS?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }

  GET_ATR(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_ATR?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }

  GET_Ord_Dtl(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_Ord_Dtl?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }

  GET_p_ORD_DTL_TD_GT(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_p_ORD_DTL_TD_GT?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }

  GET_p_TD_GT(TCODE: any) {
    return this.http.get<any>(`${this.baseUrl}TD/GET_p_TD_GT?TCODE=${TCODE}`);
  }


  Update_ATR(ATRID: any, R_STS: any, CNLD: any, Notes:any) {
    return this.http.put<any>(`${this.baseUrl}Order/Update_ATR?ATRID=${ATRID}&R_STS=${R_STS}&CNLD=${CNLD}&Notes=${Notes}`, ATRID);
  }

  Collected_ATR(ATR_ID: any, STS: any, DRAWN_DTTM: any, ACCN: any, REQ_CODE: any, ORD_NO: any, SECT: any) {
    return this.http.put<any>(`${this.baseUrl}Order/Collected_ATR?ATR_ID=${ATR_ID}&STS=${STS}&DRAWN_DTTM=${DRAWN_DTTM}&ACCN=${ACCN}&REQ_CODE=${REQ_CODE}&ORD_NO=${ORD_NO}&SECT=${SECT}`,'');
  }
  

  /* Insert New Order */
  ADD_ORD_TRNS(ORD_TRNSObj: any) {
    return this.http.post<any>(`${this.baseUrl}Order/ADD_ORD_TRNS`, ORD_TRNSObj);
  }
  ADD_ATR(ARTObj: any, SEX: any, CN: any, DOB: any, DRNO: any, LOC: any, PRFX: any, CLN_IND:any) {
    return this.http.post<any>(`${this.baseUrl}Order/ADD_ATR?SEX=${SEX}&CN=${CN}&DOB=${DOB}&DRNO=${DRNO}&LOC=${LOC}&PRFX=${PRFX}&CLN_IND=${CLN_IND}`, ARTObj);
  }

  ADD_Ord_Dtl(Ord_DtlObj: any) {
    return this.http.post<any>(`${this.baseUrl}Order/ADD_Ord_Dtl`, Ord_DtlObj);
  }
  ADD_Ord_Trc(Ord_TrcObj: any) {
    return this.http.post<any>(`${this.baseUrl}Order/ADD_Ord_Trc`, Ord_TrcObj);
  }

  ADD_ARF(ADD_ARFObj: any) {
    return this.http.post<any>(`${this.baseUrl}Order/ADD_ARF`, ADD_ARFObj);
  }


  /*Cancel Reason*/
  GET_CNLCD() {
    return this.http.get<any>(`${this.baseUrl}CancelReason/GET_CNLCD`);
  }

  /*barcode Reason*/
  GET_BARCODE(ORD_NO:any) {
    return this.http.get<any>(`${this.baseUrl}Barcode/GET_BARCODE?ORD_NO=${ORD_NO}`);
  }

}
