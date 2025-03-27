import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant'; 
import { Observable, catchError, throwError } from "rxjs";
import { reportmainHeaderModel } from 'src/app/models/reportmainHeaderModel';


@Injectable({
  providedIn: 'root'
})
export class ReportmainheaderService {
  dataChange: any;
  data: any;
  getAllIssues() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }
  
  addReportMainHeader(reportmainheaderList: reportmainHeaderModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-reportmainheader", reportmainheaderList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   updateReportMainHeader(reportmainheaderList:reportmainHeaderModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-reportmainheader/"+reportmainheaderList.rpT_MHDR_ID,reportmainheaderList);
   }
   deleteReportMainHeader(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-reportmainheader/"+id,{observe : 'response'});
  }
  getAllReportMainHeader(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllReportMainHeader");
   }  
    
  getReportMainHeaderById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetReportMainHeaderById/"+id);
   }
}
