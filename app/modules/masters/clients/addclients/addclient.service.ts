import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
//import { clientModel } from 'src/app/models/clientModel';
import { Observable, catchError, map, throwError } from "rxjs";
import { clientModel } from 'src/app/models/clientModel';


@Injectable({
  providedIn: 'root'
})
export class AddclientService {
  dataChange: any;
  data: any;
  _obj: clientModel

  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) {
    this._obj = new clientModel();

  }

  addclient(clientlist: clientModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/MasterData/Insert-client", clientlist).pipe(
      catchError(err => {
        console.error('error cought in service', err)
        return throwError(err);
      })
    );
  }

  updateclient(clientlist: clientModel) {
    return this.httpService.put(cons_baseUrl + "/api/MasterData/Update-client/" + clientlist.clnT_FL_ID, clientlist);
  }
  deleteclient(id: number) {
    return this.httpService.delete(cons_baseUrl + "/api/MasterData/Delete-client/" + id, { observe: 'response' });
  }

  getAllclient() {
    return this.httpService.get(`${cons_baseUrl}/api/MasterData/GetAllClients`).pipe(
      map((response: any) => ({
        clients: response.clients as clientModel[], // Ensure proper typing
        maxCN: response.maxCN ? response.maxCN.toString().padStart(4, '0') : "0001" // Format maxCN
      }))
    );
  }


  getclientById(id: number) {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetclientById/" + id);
  }

  GetAllAccountManager() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllAccountManager");
  }

  GetAllDriver() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllDriver");
  }

  GetAllSite() {
    return this.httpService.get(cons_baseUrl + "/api/MasterData/GetAllSite");
  }
}
