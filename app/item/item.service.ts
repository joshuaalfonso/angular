import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class itemService {

    constructor(private http: HttpClient) {}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';

    getItemData(){
        return this.http.get<any>( this.baseUrl + '/api/mssql/a_item.php');
    }
     
    getUnits(){  
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_unit.php');
    }

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

}