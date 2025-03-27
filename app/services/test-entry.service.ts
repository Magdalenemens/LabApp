import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TDModel } from '../models/tdmodel';
import { cons_baseUrl } from '../common/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestEntryService {
  
constructor(private httpService:HttpService) { }

addTest(tdModel: TDModel):Observable<Object>{
    return this.httpService.post(cons_baseUrl+"/api/TestDirectory", tdModel);   
   }
   updateTest(id:number,tdModel:TDModel): Observable<Object>{
    return this.httpService.put(cons_baseUrl+"/api/TestDirectory/UpdateTest/"+id,tdModel);
   }
  getAllTest() : Observable<TDModel[]>{
   return this.httpService.get(cons_baseUrl+"/api/TestDirectory");
  }
  getTestById(id:number): Observable<TDModel>{
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetTestById/"+id);
   }
   deleteTest(id: number): Observable<Object>{
    return this.httpService.delete(cons_baseUrl+"/api/TestDirectory/DeleteTestById/"+id);
  }
}
