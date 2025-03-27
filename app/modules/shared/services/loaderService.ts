import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = new Subject<boolean>();

  show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }

  ShowHideLoader(seconds: number){
    this.isLoading.next(true);
    setTimeout(() => {
      this.isLoading.next(false);
    }, seconds);
  }
}