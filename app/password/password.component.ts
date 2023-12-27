import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordService } from './password.service';
import { Observable, take, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { authService } from '../auth/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnDestroy{
  value!: string;
  passwordForm!:  FormGroup;
  userSub: Subscription = new Subscription;
  user_id: string = '';

  constructor(
    private passwordService: passwordService,
    private messageService: MessageService,
    private authService: authService
  ){}

  ngOnInit(): void {

    this.userSub = this.authService.user.pipe(take(1)).subscribe(user => {
      if (!!user) {
        this.user_id = user.user_id || '';
      }
    });
   
    this.passwordForm = new FormGroup({
      'order_id': new FormControl(this.user_id, Validators.required),
      'current_password': new FormControl(null, Validators.required),
      'new_password': new FormControl(null, Validators.required),
      'confirm_password': new FormControl(null, Validators.required)
    })
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }   
  }

  onSubmit(){
    let authObs: Observable<ResponseData>;
    authObs = this.passwordService.saveData(this.passwordForm.value.order_id, this.passwordForm.value.current_password, this.passwordForm.value.new_password, this.passwordForm.value.confirm_password);

    authObs.subscribe(resData =>{
  
      if( resData === 4){
        this.messageService.add({ severity: 'success', summary: 'Danger', detail:' Password Successfully Updated', life: 3000 });
        this.passwordForm.reset();
      }
      else if( resData === -4){
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Incorrect current password', life: 3000 });
      }
      else if( resData === 5){
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Please enter a new passowrd', life: 3000 });
      } 
      else if( resData === -5){
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'New password does not match', life: 3000 });
      }          
      },
      errorMessage=>{
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
      });

  }
}

interface ResponseData {

}
