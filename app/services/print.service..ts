import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TDModel } from '../models/tdmodel';
import { cons_baseUrl } from '../common/constant';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient) { }

  getSSRSReport(ssrsUrl: string): Observable<Blob> {
    const requestBody = { ssrsUrl }; 
  
    return this.http.post<Blob>(`${cons_baseUrl}/api/reports/reportserver`, 
      requestBody, 
      {
        responseType: 'blob' as 'json' // Ensures correct response type
      }
    );
  }
}
