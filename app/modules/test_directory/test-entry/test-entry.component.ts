import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TestEntryService } from 'src/app/services/test-entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TDModel } from 'src/app/models/tdmodel';
 

@Component({
  selector: 'app-test-entry',
  templateUrl: './test-entry.component.html',
  styleUrls: ['./test-entry.component.scss']
})

export class TestEntryComponent implements OnInit {
  
  constructor(private testEntryService:TestEntryService,private router :Router) { }
  
  tdmodel: TDModel[] | undefined=[];
  dropdownValues=[]=["Serum","Sputum","Stone","Stool","Swab","Synovial Fluid","Throat Swab","Tissue","Urine","Vaginal Swab",]
    
  ngOnInit() {    
   this.getAllTest();      
  }

  addTest(id: number):void{
    this.router.navigate(['add-test', id]);
  } 

  updateTest(id: number):void{
    this.router.navigate(['add-test', id]);
  }

  deleteTest(id: number){
    this.testEntryService.deleteTest(id).subscribe( data => {
      console.log(data);
      this.getAllTest();
    })
  }
  
  getAllTest():void{
    this.testEntryService.getAllTest().subscribe(x=>{
      this.tdmodel=x;       
    })}
}


 
