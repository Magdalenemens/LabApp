import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { userflModel, userJobTypeModel } from 'src/app/models/userflModel';
import {
  AbstractControl,
  FormBuilder, FormControl, FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ADD_USER_ERROR, alertTwoDigits, deleteErrorMessage, deleteMessage, errorMessage, NOT_FOUND_MESSAGE, registerSuccessMessage, REQUIRED_FIELDS, successMessage, updateSuccessMessage, USER_ALREADY_EXISTS, warningMessage } from 'src/app/common/constant';
import { Operation } from 'src/app/common/enums';
import { debounceTime, NotFoundError, Observable, Subject } from 'rxjs';
import { siteModel } from 'src/app/models/siteModel';
import { SiteService } from '../site/sites.service';

 @Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  ngOnInit(): void {

  }


}

