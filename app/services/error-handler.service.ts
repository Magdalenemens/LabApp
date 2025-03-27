import { Injectable, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { AppConstants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private router : Router) { }

  handleError(error: any): void {
    let errors: string[] = [];
    let msg: string = "";

    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    if (error) {
      msg += " - Exception Message: " + error.message;
    }
    errors.push(msg);
    

    console.error('An error occurred', errors.toString());
    if(error.error?.errorMessage == "error")
    {
      this.router.navigate(["error"], { state: { 'isInactiveUser': true } });
    }
  }


}
