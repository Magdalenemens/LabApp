import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SpinnerComponent {
  isLoading = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((value) => {
      this.isLoading = value;
    });
  }
}