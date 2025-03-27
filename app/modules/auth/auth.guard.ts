import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

import { PermissionService } from 'src/app/services/permission.service';
import { moduleBaseAction } from 'src/app/models/roleBaseAction';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  moduleBasedActionModel = new moduleBaseAction();

  constructor(private authService: AuthService, private router: Router,
    private _permissionService: PermissionService) {
    this.moduleBasedActionModel = this._permissionService.getModuleBaseRoleAccess();
  }

  //   canActivate(
  //     next: ActivatedRouteSnapshot,
  //     state: RouterStateSnapshot): boolean {
  //     const token = this.authService.isTokenValid();
  //     if (token) {
  //       let allowedRoles: string[] = next.data['roles'];
  //       if (this.authService.isAuthorized(allowedRoles)) {
  //         return true;
  //       } else {
  //         // Redirect to the login page or some other route
  //         this.router.navigate(['/dashboard']);
  //         return false;
  //       }
  //     } else {
  //       this.router.navigate(['/login']);
  //       return false;
  //     }
  //   }
  // }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowedRoles: number[] = next.data['roles'] || []; // Get allowed roles from route data
    const moduleName: string = next.data['module'] || ''; // Get module name from route data

    return this.authService.getModuleRoleAccess().pipe(
      map((modulePermissions: any[]) => {
        if (!modulePermissions || !Array.isArray(modulePermissions)) {
          console.error('Error: Module permissions are undefined or not an array.');
          this.router.navigate(['/login']);
          return false;
        }

        // Filter permissions for the specified module
        const moduleAccess = modulePermissions.find(permission =>
          permission?.module === moduleName && permission?.alloW_ACCS
        );

        if (!moduleAccess) {
          console.warn(`Access denied: User does not have permissions for the "${moduleName}" module.`);
          this.router.navigate(['/login']);
          return false;
        }

        // Check if the user has any of the allowed roles for this module
        const userRoleIds = modulePermissions
          .filter(permission => permission?.alloW_ACCS)
          .map(permission => permission.rolE_ID); // Extract the role IDs

        const userHasPermission = allowedRoles.some(roleId => userRoleIds.includes(roleId));

        if (userHasPermission) {
          return true; // Grant access
        } else {
          console.warn('Access denied: User does not have the required roles.');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error fetching module permissions:', error);
        this.router.navigate(['/login']); // Redirect to login on error
        return of(false);
      })
    );
  }


}