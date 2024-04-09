import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Check if the user is authenticated
        console.log('localStorage.getItem(isLoggedIn) => ', localStorage.getItem('isLoggedIn'))
        if (localStorage.getItem('isLoggedIn') === 'true') {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}