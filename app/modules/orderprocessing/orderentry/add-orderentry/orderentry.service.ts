import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cons_baseUrl } from 'src/app/common/constant';

@Injectable({
  providedIn: 'root'
})
export class OrderentryService {

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
    return this.http.get<any>(`${this.baseUrl}api/PatientRegistration/GetPatientRegistrationByPATID/${PRObj}`);//PR
  }

  GetPRSearch(PRObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/PatientRegistration/GetPatientRegistrationByLike/${PRObj}`);//PRSearch
  }


  GetSalesmen() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllAccountManager`);
  }

  GetOrderType() {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetAllOrderType`);
  }

  GetCLNT_FL(CLNT_FLObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetClientByCN/${CLNT_FLObj}`);//GET_CLNT_FL
  }
  GetAllClients() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllClients`);
  }
  GetDOC_FL(DOC_FLObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetDoctorFileByDrNo/${DOC_FLObj}`);//Doctor/GET_DOC_FL
  }
  GetAllDoctorFile() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllDoctorFile`);//Doctor/GET_DOC_FL
  }

  GetLOCATION(LOCATIONObj: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetLocationsFileByLoc/${LOCATIONObj}`);//Location/GET_LOCATION
  }
  GetAllLocationsFile() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllLocationsFile`);
  }
  

  /*Update and create new PR informations*/
  PutPR(PRObj: any) {
    return this.http.put<any>(`${this.baseUrl}api/PatientRegistration/UpdatePatientRegistration`, PRObj);//PR/UpdatePR
  }

  /*Serach for the Test Code*/
  GetTD(TCODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetTestDirectoryByTCode/${TCODE}`);//TD/GET_TD?TCODE=${TCODE}
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
  GET_V_TD_GTD_TCODE(REQ_CODE: any, TCODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetGroupTestsDetailedandTestDirectoryParams/${REQ_CODE}/${TCODE}`);//TD/GET_V_TD_GTD_TCODE?REQ_CODE=${REQ_CODE}&TCODE=${TCODE}
  }

  //Get Price from CLNT_SP
  //GetPriceClinetSP(CLNT_SPObj: any) {
  GetPriceClinetSP(cn: any, tcode: any) {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetSpecialPricesByParams/${cn}/${tcode}`);//Client/GET_CLNT_SP`, CLNT_SPObj
  }

  /*Generate New Order No after the ORD Transaction Inserted*/
  GET_NEW_ORD_NO() {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetLastOrdersTransactions`);// Order/GET_NEW_ORD_NO
  }


  /*Search for the Newly created order after the order was created by the end user*/
  GET_ORD_TRNS(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}Order/GET_ORD_TRNS?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`);
  }
  GET_v_ORD_TRANS(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetOrdersTransactionsDetailsByParams/${PAT_ID}/${ORD_NO}`);//Order/GET_v_ORD_TRANS?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}
  }
  GET_ALL_ORD_TRANS() {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetAllOrdersTransactions`);//Get all Order Transactions
  }

  GET_ATR(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetActiveTestsRequestByParams/${PAT_ID}/${ORD_NO}`);//Order/GET_ATR?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}`
  }

  GET_Ord_Dtl(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetOrdersDetailsByParams/${PAT_ID}/${ORD_NO}`);//Order/GET_Ord_Dtl?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}
  }

  GET_p_ORD_DTL_TD_GT(PAT_ID: any, ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetOrdersDetailsByUnion/${PAT_ID}/${ORD_NO}`);//Order/GET_p_ORD_DTL_TD_GT?PAT_ID=${PAT_ID}&ORD_NO=${ORD_NO}
  }

  GET_p_TD_GT(TCODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/TestDirectory/GetTestDirectoryandGroupTestsByTCODE/${TCODE}`);//TD/GET_p_TD_GT?TCODE=${TCODE}
  }


  Update_ATR(ATRID: any, R_STS: any, CNLD: any, Notes: any, SITE_NO:any, U_ID:any,ORD_NO:any, SEC:any,REQ_CODE:any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/CancelActiveTestRequest/${ATRID}/${R_STS}/${CNLD}/${Notes}/${SITE_NO}/${U_ID}/${ORD_NO}/${SEC}/${REQ_CODE}`, ATRID);//Order/Update_ATR?ATRID=${ATRID}&RS=${RS}&CNLD=${CNLD}&Notes=${Notes}
  }

  Collected_ATR(COLLECTIONLIST: any[], ATR_ID: any, STS: any, DRAWN_DTTM: any, ACCN: any, REQ_CODE: any, ORD_NO: any, SECT: any, REF_LAB: any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/CollectedActiveTestRequest/${ATR_ID}/${STS}/${DRAWN_DTTM}/${ACCN}/${REQ_CODE}/${ORD_NO}/${SECT}/${REF_LAB}`, COLLECTIONLIST);
  }


  /* Insert New Order */
  ADD_ORD_TRNS(ORD_TRNSObj: any) {
    return this.http.post<any>(`${this.baseUrl}api/Order/InsertOrdersTransactions`, ORD_TRNSObj)// Order / ADD_ORD_TRNS`, ORD_TRNSObj
  }
  UpdateOrdersTransactionsDetails(ORD_TRNSObj: any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/UpdateOrdersTransactionsDetails`, ORD_TRNSObj)
  }
  ADD_ATR(ARTObj: any[], SEX: any, CN: any, DOB: any, DRNO: any, LOC: any, PRFX: any, CLN_IND: any, ORD_NO: any) {
    return this.http.post<any>(`${this.baseUrl}api/Order/InsertActiveTestsRequest/${SEX}/${CN}/${DOB}/${DRNO}/${LOC}/${PRFX}/${CLN_IND}/${ORD_NO}`, ARTObj);
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
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllCNLCD`);
  }

  /*barcode Reason*/
  GET_BARCODE(ORD_NO: any) {
    return this.http.get<any>(`${this.baseUrl}api/Barcode/GenerateBarcode/${ORD_NO}`);
  }

  getBarcode(accn: string) {
    return this.http.get<any[]>(cons_baseUrl + "/api/Barcode/GetBarcode/"+accn);
  }
  getQRcode(mbListQR: any) {
    return this.http.post<any>(cons_baseUrl + "/api/Barcode/GetQRcode",mbListQR);
  }
  /*barcode Reason*/
  GetSpecimensTypes() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetAllSpecimentypes`);
  }

  AddNotesActiveTestsRequest(aTRModel: any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/AddNotesActiveTestsRequest`, aTRModel);
  }

  UpdateIssueInvoince(oRD_TRNSModel: any) {
    return this.http.put<any>(`${this.baseUrl}api/Order/UpdateIssueInvoince`, oRD_TRNSModel);
  }

  GetAllSiteDetails() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetSiteBySiteTP`);
  }

  GetMultipleSearch(IDNT: any, TEL: any, PAT_ID: any, PAT_NAME: any, DOB: any, SEX: any, ORD_NO: any, ACCN: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetMultipleSearch/${IDNT}/${TEL}/${PAT_ID}/${PAT_NAME}/${DOB}/${SEX}/${ORD_NO}/${ACCN}`);
  }

  GetMultipleSearchOrders(PAT_ID: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetMultipleSearchOrders/${PAT_ID}`);
  }
  GetOrderTrackingByOrdNo(ORD_NO: any,REQ_CODE: any) {
    return this.http.get<any>(`${this.baseUrl}api/Order/GetOrderTrackingByOrdNo/${ORD_NO}/${REQ_CODE}`);
  }

  GetSharedTableNat() {
    return this.http.get<any>(`${this.baseUrl}api/MasterData/GetSharedTableNat`);
  }

}
