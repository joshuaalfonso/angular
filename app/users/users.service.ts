import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";


@Injectable ({providedIn: 'root'})
export class usersService {

    constructor(private http: HttpClient) {}

    parsedUrl = new URL(window.location.href);
    baseUrl = this.parsedUrl.origin;
    apiUrl = '10.10.2.110';

    getUsersData(){
        return this.http.get<any>( this.baseUrl + '/api/mssql/a_user_account.php');
    }

    saveData( user_id: string, 
              name: string,
              username: string, 
              password: string, 
              email: string, 
              // status: string,
            ){
        return this.http.post( this.baseUrl+ '/api/mssql/register.php', 
        { 
          user_id: user_id, 
          name: name, 
          username: username, 
          password: password,
          email: email, 
        })
    }

}