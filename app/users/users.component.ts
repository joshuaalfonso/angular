import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { usersService } from './users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  users!: Item[];
  userForm!: FormGroup;
  visible: boolean = false;
  status: Status[] | undefined;
  
  constructor(private usersService: usersService, private messageService: MessageService){}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      'user_id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'status' : new FormControl(null, Validators.required)
    });

    this.status = [
      { name: 'Active', code: '1' },
      { name: 'Inactive', code: '2' },
  ];

    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsersData().subscribe(response => {
      this.users = response
    })
  }

  onSubmit() {
    let authObs: Observable<ResponseData>;
    authObs = this.usersService.saveData(this.userForm.value.user_id, this.userForm.value.name, this.userForm.value.email, this.userForm.value.username, this.userForm.value.password);

      authObs.subscribe(resData => {
        if( resData === 1){
          this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.userForm.value.name +  ' successfully recorded', life: 3000 });
          this.getUsers();
        }
        else if( resData === 2){
          this.messageService.add({ severity: 'success', summary: 'Danger', detail:  ''+ resData , life: 3000 });
          this.getUsers();
        }
        else if( resData === 0){
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Email ' + this.userForm.value.email +  ' arlready existing', life: 3000 });
        } 
        else if( resData === -1){
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Username ' + this.userForm.value.username +  ' arlready existing', life: 3000 });
        } 
      },
      errorMessage => {
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
      })
        
  }


  onSelect(data:any) {
    this.showDialog();
    this.userForm.setValue({
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      username: data.username,
      status: data.status
    })
  }

  showDialog() {
    this.userForm.reset();
    this.visible = true;
  }

}

interface Item {

}

interface Status {
  name: string;
  code: string;
}

interface ResponseData {

}
