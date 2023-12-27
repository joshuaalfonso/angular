import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, take, map } from "rxjs";
import { Injectable } from "@angular/core";
import { authService } from "./auth.service";


@Injectable({providedIn: 'root'})
export class roleGuard implements CanActivate {

    constructor(private authService: authService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        return this.authService.user.pipe(
            take(1),
            map(user => {
            const userRole = user?.usl;
            const reuqiredRole = route.data['role'];

            if (userRole === reuqiredRole) {
                return true;
            } else {
                return false
            }
        }), 
        );
    }
}