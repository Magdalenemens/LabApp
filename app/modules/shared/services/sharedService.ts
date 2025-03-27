import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

    public selected: string = 'adduser'; // Shared property

  constructor() { }

 
}