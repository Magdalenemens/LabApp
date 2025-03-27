import { Component } from '@angular/core';

@Component({
  selector: 'app-ptr',
  templateUrl: './ptr.component.html',
  styleUrls: ['./ptr.component.scss']
})
export class PtrComponent {
  ngOnInit(): void {
    $('#btnptr').addClass("is-active");
  }
}
