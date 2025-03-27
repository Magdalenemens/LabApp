import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cons_baseUrl } from 'src/app/common/constant';
import { GTModel } from 'src/app/models/tdmodel';
import { MnService } from 'src/app/modules/masters/mn/mn.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpService:HttpService,private http: HttpClient,private _mnService: MnService) { }

  
  getAllTestDirectoryProfile(){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetTestDirectoryProfile");
   }

   getTestDirectoryGTD(id:string){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetTestDirectoryGTD/"+id);
   }   

   GetTestDirectoryByDProfile(){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetTestDirectoryByDProfile");
   }

   getSearchTestDirectoryByDProfile(search : any){
    return this.httpService.get(cons_baseUrl+"/api/TestDirectory/GetSearchTestDirectoryByDProfile/"+search);
   }

   
   saveTestDirectoryProfile(tdGTDModel: GTModel[]) :Observable<any>{
    return this.http.post<any>(cons_baseUrl+"/api/TestDirectory/Insert-TestDirectoryProfile", tdGTDModel)
   }

}
