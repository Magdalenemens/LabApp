import { Component } from '@angular/core';

@Component({
  selector: 'app-quality-check',
  templateUrl: './quality-check.component.html',
  styleUrls: ['./quality-check.component.scss']
})
export class QualityCheckComponent {
  ngOnInit(): void {
    $('#btncheck').addClass("is-active");
  }
}
