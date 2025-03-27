import { Injectable } from '@angular/core';
import { ADD_USER_ERROR, alertThreeDigits, alertTwoDigits, BAD_REQUEST_ERROR_MESSAGE, BAD_REQUEST_MESSAGE, COMMON_MESSAGE, cons_baseUrl, deleteErrorMessage, deleteMessage, EMPTYMESSAGE, errorKeyCodeMessage, firstRecord, invokeInvoiceFailed, invokeInvoiceSuccess, lastRecord, NOT_FOUND_MESSAGE, PASSWORD_DUPLICATION, PASSWORD_SUCCESS, REQUIRED_FIELDS, successMessage, TestwarningMessage, updateSuccessMessage, USER_ALREADY_EXISTS, USER_NAME_VALIDATION, warningMessage, USER_AUTHORIZED_ERROR_MESSAGE,INCORRECT_PASSWROD, PermissionWarning_Message } from 'src/app/common/constant';
import { AuthService } from '../modules/auth/auth.service';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommonAlertService {

  constructor(private _httpService: HttpService, private _authService: AuthService) { }
  inCorrectPassword() {
    Swal.fire({
      text: INCORRECT_PASSWROD,
    });
  }
  changePasswordSuccessMessage() {
    Swal.fire({
      text: PASSWORD_SUCCESS,
    });
  }
  passworDuplicatedMessage() {
    Swal.fire({
      text: PASSWORD_DUPLICATION,
    });
  }

  userAuthorzedErrorMessage() {
    Swal.fire({
      text: USER_AUTHORIZED_ERROR_MESSAGE,
    });
  }
  // stats code 200
  successMessage() {
    Swal.fire({
      text: successMessage,
    });
  }
  // stats code 200||204
  updateMessage() {
    Swal.fire({
      text: updateSuccessMessage,
    });
  }
  // stats code code 200||204
  deleteMessage() {
    Swal.fire({
      text: deleteMessage,
    });
  }
  // stats code code 500
  deleteErrorMessage() {
    Swal.fire({
      text: deleteErrorMessage,
    });
  }
  // stats code 409
  warningMessage() {
    Swal.fire({
      text: warningMessage,
    });
  }
  // stats code 400
  badRequestMessage() {
    Swal.fire({
      text: BAD_REQUEST_ERROR_MESSAGE,
    });
  }
  // stats code 500
  errorMessage() {
    Swal.fire({
      text: BAD_REQUEST_MESSAGE,
    });
  }
  alertTwoDigits() {
    Swal.fire({
      text: alertTwoDigits,
    });
  }
  alertThreeDigits() {
    Swal.fire({
      text: alertThreeDigits,
    });
  }
  userNameValidation() {
    Swal.fire({
      text: USER_NAME_VALIDATION,
    });
  }
  notFoundMessage() {
    Swal.fire({
      text: NOT_FOUND_MESSAGE,
    });
  }

  ERROR_FETCHING_DATA() {
    Swal.fire({
      text: NOT_FOUND_MESSAGE,
    });
  }
  // stats code 409
  userExistsMessage() {
    Swal.fire({
      text: USER_ALREADY_EXISTS,
    });
  }
  addUserErrorMessage() {
    Swal.fire({
      text: ADD_USER_ERROR,
    });
  }
  requiredFieldMessage() {
    Swal.fire({
      icon: 'warning', // Add a warning icon
      title: 'Required Fields Missing', // Optional: Add a title to the warning
      text: REQUIRED_FIELDS,  // Display your predefined message
      confirmButtonText: 'OK', // Optional: Customize the confirm button text
    });
  }
  emptymassage() {
    Swal.fire({
      text: EMPTYMESSAGE,
    });
  }
  TestwarningMessage() {
    Swal.fire({
      text: TestwarningMessage,
    });
  }
  invokeInvoiceSuccess() {
    Swal.fire({
      text: invokeInvoiceSuccess,
    });
  }
  invokeInvoiceFailed() {
    Swal.fire({
      text: invokeInvoiceFailed,
    });
  }
  firstRecord() {
    Swal.fire({
      text: firstRecord,
    });
  }
  lastRecord() {
    Swal.fire({
      text: lastRecord,
    });
  }
  errorKeyCodeMessage() {
    Swal.fire({
      text: errorKeyCodeMessage,
    });
  }
  commonMessage() {
    Swal.fire({
      text: COMMON_MESSAGE,
    });
  }
  PermissionWarningMessage() {
    Swal.fire({
      text: PermissionWarning_Message,
    });
  }
}

