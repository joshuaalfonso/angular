import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class passwordService {

    constructor(private http: HttpClient) {}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';

    saveData(
        user_id: string,
        current_password: string,
        new_password: string,
        confirm_password: string
    ) {
        return this.http.post( 
            this.baseUrl+ '/api/mssql/b_change_password.php', 
            {
                user_id: user_id,
                current_password: current_password, 
                new_password: new_password, 
                confirm_password: confirm_password
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                return resData;
            })
        )   
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        return throwError(errorMessage);
    }


}