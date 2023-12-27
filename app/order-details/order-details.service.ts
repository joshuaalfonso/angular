import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: 'root' })

export class orderDetailsService {

    constructor(private http: HttpClient) {}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';


    getOrders(){  
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_order.php');
    }

    getOrderDetails(id:string){
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_order_details_tbl.php?id=' + id);
    }

    getCustomerName(){  
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_customer.php');
    }

    getItemName(){
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_item.php');
    }

    onDeleteItem(id:string){
      return this.http.get<any>( this.baseUrl + '/api/mssql/a_delete.php?id=' + id);
    }
    

    saveData(
      order_id: string,
      order_date: string,
      customer_id: string,
      order_details: string [],
      total_quantity: number,
      total_amount: number,
      token:string
  ){

  // const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'x-auth-token': token
  // });

  // const requestOptions = { headers: headers };

  return this.http
  .post(
     this.baseUrl+ '/api/mssql/b_order_details.php',
    {
      order_id : order_id,
      customer_id: customer_id,
      order_date: order_date,
      order_details: order_details,
      total_quantity: total_quantity,
      total_amount: total_amount
  
    },
    // requestOptions,
  )

  // .pipe(
  //   catchError(this.handleError),
  //   tap(resData => {
  //    return resData;
  //   })
  // );
}  

// private handleError(errorRes: HttpErrorResponse) {
//   let errorMessage = 'An unknown error occurred!';
//   return throwError(errorMessage);
// }

  //   saveData(
  //       customer_id: number,
  //       customer_name: string,
  //       address: string,
  //       contact: string,
  //       email: string,  
  //     ){
  
  //   return this.http
  //   .post(
  //      this.baseUrl+ '/api/mssql/b_customer.php',
  //     {
  //       customer_id: customer_id,
  //       customer_name : customer_name,
  //       address: address,
  //       contact: contact,
  //       email: email,
  //     },

  //   )

  // }
}