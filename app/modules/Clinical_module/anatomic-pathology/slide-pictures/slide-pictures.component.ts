import { Component } from '@angular/core';

@Component({
  selector: 'app-slide-pictures',
  templateUrl: './slide-pictures.component.html',
  styleUrls: ['./slide-pictures.component.scss']
})
export class SlidePicturesComponent {
  ngOnInit(): void {
    $('#btnspictures').addClass("is-active");
  }
}
