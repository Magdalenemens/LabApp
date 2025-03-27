import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
//import { clientModel } from 'src/app/models/clientModel';
import { Observable, catchError, throwError } from "rxjs";
import { clientModel } from 'src/app/models/clientModel';


@Injectable({
  providedIn: 'root'
})
export class AddUserService {
  dataChange: any;
  data: any;
  _obj: clientModel

  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) {
    this._obj = new clientModel();

  }

}