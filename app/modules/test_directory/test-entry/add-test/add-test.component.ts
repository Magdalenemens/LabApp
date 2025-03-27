import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TDModel } from 'src/app/models/tdmodel';
import { TestEntryService } from 'src/app/services/test-entry.service';

@Component({
  selector: 'app-add-test-entry',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.scss']
})
export class AddTestEntryComponent implements OnInit {

  tdmodel: TDModel = new TDModel();
  id: number = 0;

  constructor(private testEntryService: TestEntryService, private router: Router,
     private route: ActivatedRoute,) {
    this.id = this.route.snapshot.params['id'];
  }
  
  dropdownValues=[]=["Serum","Sputum","Stone","Stool","Swab","Synovial Fluid","Throat Swab","Tissue","Urine","Vaginal Swab",]
  ngOnInit(): void {   
    if (this.id != 0) {
      this.GetDataById(this.id);
    }
  }

  Add(){
    this.testEntryService.addTest(this.tdmodel).subscribe( data =>{
      console.log(data);
      this.goToTestList();
    },
    error => console.log(error));
  }

  Update() {
    this.testEntryService.updateTest(this.id, this.tdmodel).subscribe( data =>{
      this.goToTestList();
    }
    , error => console.log(error));
  }

  onSubmit() {
    if (this.id != 0) {
      this.Update();
    } else { this. Add (); }
  }

  goToTestList(){
    this.router.navigate(['test-entry']);
  }

  GetDataById(id: number) {
    this.testEntryService.getTestById(id).subscribe(x => {
      this.tdmodel = x;
    });
  }

  goBack(){
    this.router.navigate(['test-entry']);
  } 
}

