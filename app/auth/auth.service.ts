import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, tap, throwError, Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class authService {

    user = new BehaviorSubject<User | null>(null);

    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';  
 
    logIn(
        user_id: number,
        username: string,
        password: string,
        token: string
    ) 
    {

        return this.http.post(this.baseUrl+ '/api/mssql/login.php',
         { 
           user_id: user_id, 
           username: username, 
           password: password,
         }, 
         ) 

         .pipe(catchError(this.handleError), tap((resData: any)=> {
            if (resData.data) {
                this.handleAuthentication(resData.data.user_id, resData.data.username, resData.data.token, +resData.data.expiresIn, resData.data.usl);
            } 
          })
        );
    }    

    private handleError(resData: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        return throwError(errorMessage);
    }

    private handleAuthentication(
        user_id: string, 
        username: string,
        token: string, 
        expiresIn: number,
        usl: string
    ) {
        const expirationDate = new Date ( new Date().getTime() + expiresIn * 1000 );
        const user = new User( user_id, username, token, expirationDate, usl);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    autoLogin() {
        const userData: {
            user_id: string;
            username: string;
            _token: string;
            _tokenExpirationDate: string;
            usl: string;
        } = JSON.parse(localStorage.getItem('userData')!);

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.user_id,
            userData.username, 
            userData._token, 
            new Date(userData._tokenExpirationDate),
            userData.usl
        );
        
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expirationDuration);
    }

}
interface AuthResponseData {
    user_id: string;
    username: string;
    token: string;
    expiresIn: number;
}