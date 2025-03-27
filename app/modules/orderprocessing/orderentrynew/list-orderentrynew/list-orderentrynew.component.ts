import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Modal } from 'bootstrap';
//import DataTable from 'datatables.net-bs4';
//import { ArrowFunctionExpr } from '@angular/compiler';
import { cleanData } from 'jquery';
import { OrderentrynewService } from '../add-orderentrynew/orderentrynew.service';


@Component({
  selector: 'app-list-orderentrynew',
  templateUrl: './list-orderentrynew.component.html',
  styleUrls: ['./list-orderentrynew.component.scss']
})
export class ListOrderentrynewComponent {
 
  constructor(private fb: FormBuilder, private auth:OrderentrynewService,  private router: Router) {

  }
  ngOnInit(): void {
    $('#btnlist').addClass("is-active");
  }
}
