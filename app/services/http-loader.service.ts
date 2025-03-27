import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderService {

  apiCount: number = 0;
  showLoader: Subject<boolean> = new Subject();

  constructor() { }

  setLoader(show: boolean): void {
    this.showLoader.next(show);
  }
}
