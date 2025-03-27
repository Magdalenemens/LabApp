import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-assignment',
  templateUrl: './test-assignment.component.html',
  styleUrls: ['./test-assignment.component.scss']
})
export class TestAssignmentComponent {

  constructor(private router: Router) { }

  redirectToTestImport() {
    this.router.navigate(['test-directory/testdefination/test-imports']);
  }

}
