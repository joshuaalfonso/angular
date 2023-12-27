import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { catchError, tap, throwError} from "rxjs";


@Injectable({ providedIn: 'root' })

export class customerService {

    constructor(private http: HttpClient) {}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';

    getCustomerData(token: string){

      // const headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   'x-auth-token': token
      // });    

      // const requestOptions = { headers: headers };

      return this.http.get<any>( this.baseUrl + '/api/mssql/a_customer.php');
    }

    saveData(
      customer_id: number,
      customer_name: string,
      address: string,
      contact: string,
      email: string,  
      token:string
    ){

  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token
  });

  const requestOptions = { headers: headers };

  return this.http
  .post(
     this.baseUrl+ '/api/mssql/b_customer.php',
    {
      customer_id: customer_id,
      customer_name : customer_name,
      address: address,
      contact: contact,
      email: email,
    },
    requestOptions,
  )

  .pipe(
    catchError(this.handleError),
    tap(resData => {
     return resData;
    })
  );
}

private handleError(resData: HttpErrorResponse) {
  let errorMessage = 'An unknown error occurred!';
  return throwError(errorMessage);
}

}