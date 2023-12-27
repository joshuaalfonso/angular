import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { customerService } from './customer.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, take } from 'rxjs';
import { Table } from 'primeng/table';
import { authService } from '../auth/auth.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [MessageService]
  
})
export class CustomerComponent implements OnInit{

  visible: boolean = false;

  customers!: Customer[];

  customerForm!: FormGroup;

  userSub: Subscription = new Subscription;

  formHeader: any;

  userToken: string = '';

  isLoading = false;

  constructor(private http: HttpClient,
              private customerService: customerService,
              private messageService: MessageService,
              private authService: authService
  ) {}

  ngOnInit() {

    // this.userSub = this.authService.user.subscribe(user => {

    //   if(!!user) {
    //     this.userToken = user.token || '';
    //   }
    
    // })

    this.userSub = this.authService.user.pipe(take(1)).subscribe(user => {
      if (!!user) {
        this.userToken = user.token || '';
      }
    });
    

    this.customerForm = new FormGroup ({
      'customer_id': new FormControl(0),
      'customer_name': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'contact': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required)
    })
    this.getItem();
  }

  getItem(){
    this.isLoading = true;
    this.customerService.getCustomerData(this.userToken).subscribe(
      (response: any) => {
        this.customers = response;
        this.isLoading = false ;
      }
      );
  }

  getCustomerName(){
    return sessionStorage.getItem('username');
  }

  onSubmit() {
    // console.log(this.customerForm.value);
    let authObs: Observable<ResponseData>;
    authObs = this.customerService.saveData( this.customerForm.value.customer_id, this.customerForm.value.customer_name, this.customerForm.value.address, this.customerForm.value.contact, this.customerForm.value.email, this.userToken);

    authObs.subscribe(resData =>{
  
      if( resData === 1){
        this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.customer_name +  ' successfully recorded', life: 3000 });
        this.getItem();
        this.clearItems();
      }
      else if( resData === 2){
        this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.customer_name +  ' successfully updated', life: 3000 });
        this.getItem();
        this.clearItems();
      }
      else if( resData === 0){
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.customerForm.value.customer_name +  ' arlready existing', life: 3000 });
      }              
      },
      errorMessage=>{
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
  });
    
  }

  onSelect(data:any){
    this.formHeader = 'Edit Customer';
    this.visible = true;

    this.customerForm.setValue({
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      address: data.address,
      contact: data.contact,
      email: data.email
    })
  
  }

  showDialog() {
    this.visible = true;
    this.formHeader = 'Add New Customer';
    this.clearItems();
  }

  clearItems(){
    this.customerForm.reset();
  }

  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
}

}

interface Customer {
  customer_id: number;
  customer_name: string;  
  email: string;
  contact: string;
  address: string;
}

interface ResponseData {

}
