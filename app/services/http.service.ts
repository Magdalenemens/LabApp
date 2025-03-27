import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient, private errorHandler:ErrorHandlerService) { }

  get(url:string, params?:HttpParams): Observable<any>
  {
    let req = params ? this.httpClient.get(url, {params:params}) : this.httpClient.get(url);

    return req.pipe(
      map((response) => 
         {
            return this.handleResponse(response);
         }));
  }

  post(url: string, data: any): Observable<any>
  {   
    if(data)
    {
        return this.httpClient.post(url, data,{ observe: 'response' }).pipe(
          map((res) => 
           {
             return this.handleResponse(res);
           }),
        );
    }
     return data;
   }

  put(url: string, data: any): Observable<any>
  {
    if(data)
    {
        return this.httpClient.put(url, data,{ observe: 'response' }).pipe(
          map((res) => 
           {
             return this.handleResponse(res);
           }),
        );
    }
    return data;
   }

   delete(url: string, options?:any): Observable<any>
   {
       let req = options ? this.httpClient.delete(url, options) : this.httpClient.delete(url);
         return req.pipe(
           map((res) => 
            {
              return this.handleResponse(res);
            }),
         );
    }

    patch(url: string, data: any): Observable<any>
    {
      if(data)
      {
          return this.httpClient.patch(url, data,{ observe: 'response' }).pipe(
            map((res) => 
              {
                return this.handleResponse(res);
              }),
          );
      }
      return data;
    }  

    private handleResponse(response: any) {
      if (response && response.hasOwnProperty('statusCode')) {
        if ((response.status >= 200 && response.status  < 300) || response.status == 409|| response.status == 409) {
          return response;
        } else {
          this.errorHandler.handleError(response["errorMessage"]);
        }
      } else {
        return response;
      }
    }
  }
