import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService, Message } from 'primeng/api';
import { authService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{

  loginForm!: FormGroup;

  token: any;

  counter: number = 0;

  constructor(private http: HttpClient,
    private authService: authService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    
    this.loginForm = new FormGroup ({
      'user_id': new FormControl(0),
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    })

  }

  onLogin() {
    let authObs: Observable<ResponseData>;
    authObs = this.authService.logIn( this.loginForm.value.user_id, this.loginForm.value.username, this.loginForm.value.password, "");

    authObs.subscribe( (resData: any)=> {
  
      if(this.loginForm.valid){
        if (resData.data) {
          this.router.navigate(['/customer']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: resData.message , life: 3000 });
          this.counter ++;
        }
      }
      console.log(resData);

      setTimeout(()=> {
        // this.messages = [];
      }, 3000)

    }) 
  }

}

interface ResponseData{
  
}
