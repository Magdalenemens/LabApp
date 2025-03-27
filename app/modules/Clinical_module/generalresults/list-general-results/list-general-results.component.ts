import { Component } from '@angular/core';

@Component({
  selector: 'app-list-general-results',
  templateUrl: './list-general-results.component.html',
  styleUrls: ['./list-general-results.component.scss']
})
export class ListGeneralResultsComponent {
  ngOnInit(): void {
    $('#btnlist').addClass("is-active");
  }
}
