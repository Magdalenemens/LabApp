import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { cons_baseUrl } from 'src/app/common/constant';
import { BehaviorSubject, Observable, map, of } from "rxjs";
import { loginModel } from 'src/app/models/loginModel';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { EncryptionHelper } from '../../interceptors/encryption-helper';
import { modulePermissionModel, rolePermissionModel } from '../../models/rolePermissionModel';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private tokenSubject: BehaviorSubject<string | null> = null;
  public token$: Observable<string | null>;

  private userNameSubject: BehaviorSubject<string | null> = null;
  public userName$: Observable<string | null>;

  private fullNameSubject: BehaviorSubject<string | null> = null;
  public fullName$: Observable<string | null>;

  private refSiteSubject: BehaviorSubject<string | null> = null;
  public refSite$: Observable<string | null>;

  private refLabSubject: BehaviorSubject<string | null> = null;
  public refLab$: Observable<string | null>;

  private siteNameSubject: BehaviorSubject<string | null> = null;
  public siteName$: Observable<string | null>;

  private siteAbrvSubject: BehaviorSubject<string | null> = null;
  public siteAbrv$: Observable<string | null>;

  private siteNoSubject = new BehaviorSubject<string>('');

  rolePermissionModel: rolePermissionModel[] = [];
  modulePermissionModel: modulePermissionModel[] = [];

  constructor(private httpService: HttpService) {
    let token = localStorage.getItem('secret');
    let fullname = localStorage.getItem('fullName');
    this.tokenSubject = new BehaviorSubject<string | null>(token);
    this.token$ = this.tokenSubject.asObservable();

    this.userNameSubject = new BehaviorSubject<string | null>(null);
    this.userName$ = this.userNameSubject.asObservable();

    this.fullNameSubject = new BehaviorSubject<string | null>(null);
    this.fullName$ = this.fullNameSubject.asObservable();

    this.refSiteSubject = new BehaviorSubject<string | null>(null);
    this.refSite$ = this.refSiteSubject.asObservable();

    this.refLabSubject = new BehaviorSubject<string | null>(null);
    this.refLab$ = this.refLabSubject.asObservable();

    this.siteNameSubject = new BehaviorSubject<string | null>(null);
    this.siteName$ = this.siteNameSubject.asObservable();

    this.siteAbrvSubject = new BehaviorSubject<string | null>(null);
    this.siteAbrv$ = this.siteAbrvSubject.asObservable();

    this.setData(token, fullname);

  }

  authenticateUser(_loginModel: loginModel): Observable<any> {
    return this.httpService.post(cons_baseUrl + "/api/Auth/validateUser/", _loginModel)
      .pipe(map(response => {
        if (response && response.body.token) {
          localStorage.setItem('secret', response.body.token);
          localStorage.setItem('fullName', EncryptionHelper.encrypt(response.body.fullName));
          this.tokenSubject.next(response.body.token);
          this.setData(response.body.token, response.body.fullName);
        }
        return response;
      }));
  }

  getLocalStorageToken(): string | null {
    return localStorage.getItem('secret');
  }

  getUserFullName(): string | null {
    return localStorage.getItem('fullName');
  }


  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getuserId(): string | null {
    return localStorage.getItem('userId');
  }

  getSessionId(): string | null {
    return localStorage.getItem('sessionId');
  }

  isTokenValid(): boolean {
    const token = this.getLocalStorageToken();
    if (!token) {
      return false;
    }
    try {
      let decrypttoken = EncryptionHelper.decrypt(token)
      const decodedToken = jwtDecode<JwtPayload>(decrypttoken);
      const expirationTime = decodedToken.exp! * 1000; // Convert to milliseconds
      const isExpired = Date.now() > expirationTime;
      return !isExpired;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  setData(token, fullname) {

    if (token && fullname) {
      token = EncryptionHelper.decrypt(token);
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      this.userNameSubject.next(EncryptionHelper.encrypt((JSON.parse(atob(token.split('.')[1]))).userName));
      this.siteNoSubject.next(JSON.parse(atob(token.split('.')[1])).siteNo);
      localStorage.setItem('tokenType', 'Bearer');
      localStorage.setItem("userId", EncryptionHelper.encrypt((JSON.parse(atob(token.split('.')[1]))).userId));
      localStorage.setItem("roleId", EncryptionHelper.encrypt((JSON.parse(atob(token.split('.')[1]))).roleId));
      localStorage.setItem("roleName", EncryptionHelper.encrypt((JSON.parse(atob(token.split('.')[1]))).roleName));
      localStorage.setItem("sessionId", (JSON.parse(atob(token.split('.')[1]))).sessionId);
    }
  }

  setSiteNo(siteNo: string): void {
    localStorage.setItem('site', EncryptionHelper.encrypt(siteNo));
    this.siteNoSubject.next(siteNo);   
  }

  setRoleId(roleId: string): void {
    localStorage.setItem('roleId', EncryptionHelper.encrypt(roleId));   
  }

  setRoleName(roleName: string): void {
    localStorage.setItem('roleName', EncryptionHelper.encrypt(roleName));  
  }

  setCompanyNo(companyNo: string): void {
    localStorage.setItem('company', EncryptionHelper.encrypt(companyNo));
    this.siteNoSubject.next(companyNo);  
  }

  get siteNo$() {
    return this.siteNoSubject.asObservable();
  }

  getSiteNo() {
    return localStorage.getItem('site');
  }

  getRoleId() {
    return localStorage.getItem('roleId');

  }

  getRoleName() {
    return localStorage.getItem('roleName');
  }

  getCompanyNo() {
    return localStorage.getItem('company');
  }

  getRefSiteNo() {
    return localStorage.getItem('refSite');
  }

  getRefLab() {
    return localStorage.getItem('refLab');
  }

  getSiteName() {
    return localStorage.getItem('siteName');
  }

  getSiteAbbreviation() {
    return localStorage.getItem('abrv');
  }

  setSiteRefNo(refSite: any) {
    localStorage.setItem('refSite', EncryptionHelper.encrypt(refSite));
    this.refSiteSubject.next(refSite);
  }

  setRefLab(refLab: string): void {
    localStorage.setItem('refLab', EncryptionHelper.encrypt(refLab));
    this.refLabSubject.next(refLab);
  }

  setSiteName(siteName: string): void {
    localStorage.setItem('siteName', EncryptionHelper.encrypt(siteName));
    this.siteNameSubject.next(siteName);
  }

  setSiteAbbreviation(abrv: string): void {
    localStorage.setItem('abrv', EncryptionHelper.encrypt(abrv));
    this.siteAbrvSubject.next(abrv);  
  }


  clearToken(): void {
    this.tokenSubject.next(null);
    this.userNameSubject.next(null);
    this.fullNameSubject.next(null);
    this.siteNoSubject.next(null);
    this.refSiteSubject.next(null);
    this.refLabSubject.next(null);
    this.siteNameSubject.next(null);
    this.siteAbrvSubject.next(null);
    localStorage.clear();
  }

  getAllIssues() {
    throw new Error('Method not implemented.');
  }

  getRoleAccess() {
    if (this.rolePermissionModel || this.rolePermissionModel.length == 0) {
      this.httpService.get(cons_baseUrl + "/api/Permission/GetRolePermission/" + EncryptionHelper.decrypt(this.getRoleId()))
        .subscribe(response => {
          this.rolePermissionModel = response;
          localStorage.setItem("rolePermission", JSON.stringify(this.rolePermissionModel));
        })
    }
    this.getRoleAccessFromLocalStorage();
    return this.rolePermissionModel;
  }

  getRoleAccessFromLocalStorage() {
    this.rolePermissionModel = JSON.parse(localStorage.getItem("rolePermission"));
  }

  public isAuthorized(allowedRoles: string[]): boolean {
    this.getRoleAccess();
    // const user = this.currentUserValue;
    // if (!user) return false;
    //  return this.rolePermissionModel.some(role => allowedRoles.includes(role.rOLE_NAME));
    if (allowedRoles != undefined)
      return allowedRoles.includes(EncryptionHelper.decrypt(this.getRoleName())?.toString());
    return true
  }

  getModuleRoleAccess(): Observable<any[]> {
    if (this.modulePermissionModel) {
      this.httpService.get(cons_baseUrl + "/api/Permission/GetModuleRolePermission/" + EncryptionHelper.decrypt(this.getRoleId()))
        .subscribe(response => {
          this.modulePermissionModel = response;
          localStorage.setItem("modulePermission", JSON.stringify(this.modulePermissionModel));
        })
    }
    this.getModuleRoleAccessFromLocalStorage();
    return of(this.modulePermissionModel);
  }


  getModuleRoleAccessFromLocalStorage() {
    this.modulePermissionModel = JSON.parse(localStorage.getItem("modulePermission"));
  }
}
