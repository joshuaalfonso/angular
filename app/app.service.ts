import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })



export class Service {

  constructor(private http: HttpClient) {}

  parsedUrl = new URL(window.location.href);
  baseUrl = this.parsedUrl.origin;

 

  apiUrl = '10.10.2.110';


//   getActivated(token:string) {

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'x-auth-token': token
//     });

//     const requestOptions = { headers: headers };

//     return this.http
//       .get<any>(
//         this.baseUrl +'/mssql/area?list=1',
//         requestOptions
//       )
//       .pipe(
//         catchError(this.handleError),
//         map(result => {
//           return result.map(data => {
//             return {
//               ...data
//             };
//           });
//         })
//       )
//   }

//   getAreaID(ID: string, token:string) {

//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'x-auth-token': token
//     });

//     const requestOptions = { headers: headers };

//     return this.http
//       .get<any>(
//         this.baseUrl +'/api_mis/area?ID=' + ID,
//         requestOptions
//       )
//       .pipe(
//         catchError(this.handleError),
//         map(result => {
//           return result.map(data => {
//             return {
//               ...data
//             };
//           });
//         })
//       )
//   }

  saveData(
        item_id: string,
        item_code: string,
        item_name: string,
        price: number,
        unit: string,      
        token:string
  ){

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': token
    });

    const requestOptions = { headers: headers };

    return this.http
    .post(
       this.baseUrl+ '/api/mssql/b_item.php',
      {
        item_id : item_id,
        item_code:item_code,
        item_name: item_name,
        price: price,
        unit: unit,
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

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    return throwError(errorMessage);
  }
 
  getItemData(){
    // return this.http.get<any>('assets/product-list.json');

    return this.http.get<any>( this.baseUrl + '/api/mssql/a_item.php');
  }

  getUnits(){
    // return this.http.get<any>('assets/product-list.json');

    return this.http.get<any>( this.baseUrl + '/api/mssql/a_unit.php');
  }

  

}




