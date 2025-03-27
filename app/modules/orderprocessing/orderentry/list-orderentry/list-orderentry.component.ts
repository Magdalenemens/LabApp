
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Modal } from 'bootstrap';
//import DataTable from 'datatables.net-bs4';
//import { ArrowFunctionExpr } from '@angular/compiler';
import { cleanData } from 'jquery';
import { OrderentryService } from '../add-orderentry/orderentry.service';

@Component({
  selector: 'app-list-orderentry',
  //standalone: true,
  //imports: [],
  templateUrl: './list-orderentry.component.html',
  styleUrls: ['./list-orderentry.component.scss']
})
export class ListOrderentryComponent implements OnInit {

 

  constructor(private fb: FormBuilder, private auth:OrderentryService,  private router: Router) {

  }
  ngOnInit(): void {
    $('#btnlist').addClass("is-active");
  }


  

}






