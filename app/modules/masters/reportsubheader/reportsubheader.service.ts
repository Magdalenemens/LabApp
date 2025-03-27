import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { reportmainHeaderModel } from 'src/app/models/reportmainHeaderModel';
import { reportsubHeaderModel } from 'src/app/models/reportsubHeaderModel';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsubheaderService {

  dataChange: any;
  data: any;
  getAllIssues() {  
    throw new Error('Method not implemented.');
  }
  
  constructor(private httpService:HttpService) { }

  addReportSubHeader(reportsubheaderList: reportsubHeaderModel) :Observable<any>{
    return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-reportsubheader", reportsubheaderList).pipe(
      catchError(err=>{
        console.error('error cought in service', err)
         return throwError(err);
      })
    );   
   }
   
   updateReportSubHeader(reportsubheaderList:reportsubHeaderModel){
    return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-reportsubheader/"+reportsubheaderList.rpT_SHDR_ID,reportsubheaderList);
   }

   deleteReportSubHeader(id: number){
    return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-reportsubheader/"+id,{observe : 'response'});
  }
  getAllReportSubHeader(){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllReportSubHeader");
   }     
    
  getReportSubHeaderById(id:number){
    return this.httpService.get(cons_baseUrl+"/api/MasterData/GetReportSubHeaderById/"+id);
   }
}
