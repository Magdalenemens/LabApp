// import { Injectable } from '@angular/core';
// import { HttpService } from 'src/app/services/http.service';
// import { cons_baseUrl } from '../common/constant';
// import { divisionModel } from 'src/app/models/divisionModel';
// import { Observable, catchError, throwError } from "rxjs";
 

// @Injectable({
//   providedIn: 'root'
// })
// export class MasterDataService {
//   dataChange: any;
//   data: any;
//   getAllIssues() {
//     throw new Error('Method not implemented.');
//   }
  
//   constructor(private httpService:HttpService) { }
  
//   addDivision(divisionlist: divisionModel) :Observable<any>{
//     return this.httpService.post(cons_baseUrl+"/api/MasterData/Insert-division", divisionlist).pipe(
//       catchError(err=>{
//         console.error('error cought in service', err)
//          return throwError(err);
//       })
//     );   
//    }
//    updateDivision(divisionlist:divisionModel){
//     return this.httpService.put(cons_baseUrl+"/api/MasterData/Update-division/"+divisionlist.diV_ID,divisionlist);
//    }
//    deleteDivision(id: number){
//     return this.httpService.delete(cons_baseUrl+"/api/MasterData/Delete-Divsion/"+id,{observe : 'response'});
//   }
//   getAllDivision(){
//     return this.httpService.get(cons_baseUrl+"/api/MasterData/GetAllDivision");
//    }  
    
//   getDivisionById(id:number){
//     return this.httpService.get(cons_baseUrl+"/api/MasterData/GetDivisionById/"+id);
//    }
// }
