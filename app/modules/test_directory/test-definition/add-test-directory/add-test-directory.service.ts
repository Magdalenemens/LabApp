import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { TDModel } from 'src/app/models/tdmodel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { apTestDefinitionModel } from 'src/app/models/apTestDefinitionModel';
import { evProfiledModel, evProfileGTDModel, evTDReferenceRangeModel, evTestDefinitionModel } from 'src/app/models/evTestDefinitionModel ';
import { anlMethodModel, evSubHeaderModel } from 'src/app/models/evSetupModel';
import { cgProfileGTDModel, cgTestDefinitionModel } from 'src/app/models/cgTestDefinitionModel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AddTestDirectoryService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  constructor(private httpService: HttpService) { }

  getAllTD() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllTestDirectory");
  }

  getAllAPTestDefinition() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllAPTestDefinition");
  }

  insertAPTestDefinition(apTestDefinitionData: apTestDefinitionModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/InsertAPTestDefinition", apTestDefinitionData).pipe(
      catchError(err => {
        console.error('error caught in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateAPTestDefinition(apTestDefinitionData: apTestDefinitionModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateAPTestDefinition/" + apTestDefinitionData.tesT_ID, apTestDefinitionData);
  }

  deleteAPTestDefinition(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteAPTestDefinition/" + id, { observe: 'response' });
  }

  insertEVTestDefinition(evTestDefinitionData: evTestDefinitionModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/InsertEVTestDefinition", evTestDefinitionData).pipe(
      catchError(err => {
        console.error('error caught in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateEVTestDefinition(evTestDefinitionData: evTestDefinitionModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateEVTestDefinition/" + evTestDefinitionData.tD_ID, evTestDefinitionData);
  }

  deleteEVTestDefinition(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteEVTestDefinition/" + id, { observe: 'response' });
  }


  // getAllEVTestDefinition(pagenumber:number,RowOfPage:number) {
  //   return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVTestDefinition/"+pagenumber+"/"+RowOfPage);
  // }

  getAllEVTestDefinition() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVTestDefinition");
  }

  insertReferenceRange(evTDReferenceRangeModel: evTDReferenceRangeModel[]): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/Insert-EVReferenceRanges", evTDReferenceRangeModel)
  }

  updateReferenceRange(evTDReferenceRangeModel: evTDReferenceRangeModel[]): Observable<any> {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/Update-EVReferenceRanges", evTDReferenceRangeModel)
  }

  getReferenceRangeTCodeFromTD(tCode: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchEVTDByReferenceRange/" + tCode);
  }

  getEVTDferenceRangeByType(sType: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchEVTDReferenceRangeByType/" + sType);
  }

  deleteEVReferenceRange(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteEVReferenceRange/" + id, { observe: 'response' });
  }

  getAllEVReferenceRangeByType(sType: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVReferenceRange/" + sType);
  }

  insertProfile(evProfileModelList: evProfileGTDModel[]): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/Insert-EVTestDefinitionProfile", evProfileModelList)
  }

  updateProfile(evProfileModelList: evProfileGTDModel[]): Observable<any> {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/Update-EVTestDefinitionProfile", evProfileModelList)
  }

  getAllEVTestDefinitionProfile() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVTestDefinitionProfile");
  }

  getEVTestDefinitionById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetEVDefinitionById/" + id);
  }

  getEVProfileFromGTD(tCode: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchEVProfileFromGTD/" + tCode);
  }

  getEVProfileFromGTDByTCode(gtdCode: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchProfileByGTDTCode/" + gtdCode);
  }

  getTestByCdde(code: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetTestDirectoryByTCode/" + code);
  }

  getAllEVProfiles(search: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVProfiles/" + search);
  }


  deleteEVProfile(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteEVProfile/" + id, { observe: 'response' });
  }

  addAnlMethod(anlList: anlMethodModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/Insert-anlmethod", anlList).pipe(
      catchError(err => {
        console.error('error cought in service', err)
        return throwError(err);
      })
    );
  }
  updateAnlMethod(anlList: anlMethodModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/Update-anlmethod/" + anlList.anL_MTHD_ID, anlList);
  }

  deleteAnlMethod(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/delete-anlmethod/" + id, { observe: 'response' });
  }

  getAllAnlMethod() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllANLMethod");
  }

  getAnlMethodById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetANLMethodById/" + id);
  }

  addEVSubHeader(evSubHeaderList: evSubHeaderModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/Insert-evsubheader", evSubHeaderList).pipe(
      catchError(err => {
        console.error('error cought in service', err)
        return throwError(err);
      })
    );
  }
  updateEVSubHeader(evSubHeaderList: evSubHeaderModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/Update-evsubheader/" + evSubHeaderList.eV_SUBHDR_ID, evSubHeaderList);
  }

  deleteEVSubHeader(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/delete-evsubheader/" + id, { observe: 'response' });
  }

  getAllEVSubHeader() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllEVSubHeader");
  }

  getAEVSubHeaderById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetEVSubHeaderById/" + id);
  }

  getTDComboswithTableName(TableName: string, ID: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetTestDirectoryCombosByTable/" + TableName + "/" + ID);
  }

  insertCGTestDefinition(cgTestDefinitionData: cgTestDefinitionModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/InsertCGTestDefinition", cgTestDefinitionData).pipe(
      catchError(err => {
        console.error('error caught in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateCGTestDefinition(cgTestDefinitionData: cgTestDefinitionModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateCGTestDefinition/" + cgTestDefinitionData.tD_ID, cgTestDefinitionData);
  }

  deleteCGTestDefinition(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteCGTestDefinition/" + id, { observe: 'response' });
  }

  getAllCGTestDefinition() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllCGTestDefinition");
  }

  getMaxValueFromTestID(tableName: string, columnName: string): Observable<any> {
    if (!tableName || !columnName) {
      throw new Error("Table name and column name must not be empty.");
    }

    const url = `${cons_baseUrl}/api/Utility/GetMaxValue/${tableName}/${columnName}`;
    return this.httpService.get(url);
  }


  getCGTestDefinitionById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetCGDefinitionById/" + id);
  }

  insertCGProfile(cgProfileModelList: cgProfileGTDModel[]): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/managecgprofile", cgProfileModelList)
  }

  updateCGProfile(cgProfileModelList: cgProfileGTDModel[]): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/managecgprofile", cgProfileModelList)
  }

  getAllCGTestDefinitionProfile() {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllCGTestDefinitionProfile");
  }

  getCGProfileFromGTD(tCode: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchCGProfileFromGTD/" + tCode);
  }

  getCGProfileFromGTDByTCode(gtdCode: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/FetchCGProfileByGTDTCode/" + gtdCode);
  }

  getAllCGProfiles(search: string) {
    return this.httpService.get(cons_baseUrl + "/api/TestDirectory/GetAllCGProfiles/" + search);
  }

  deleteCGProfile(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteCGProfile/" + id, { observe: 'response' });
  }

  insertTestDirectory(testData: TDModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/TestDirectory/InsertTestDirectory", testData).pipe(
      catchError(err => {
        console.error('error caught in InsertUser service', err)
        return throwError(err);
      })
    );
  }

  updateTestDirectory(testDirectoryData: TDModel) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateTestDirectory/" + testDirectoryData.tesT_ID, testDirectoryData);
  }

  updateTestDirectoryList(testDirectoryData: TDModel[]) {
    return this.httpService.put(cons_baseUrl + "/api/TestDirectory/UpdateTestDirectoryList", testDirectoryData);
  }

  deleteTestDirectory(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/TestDirectory/DeleteTestDirectory/" + id, { observe: 'response' });
  }

}
