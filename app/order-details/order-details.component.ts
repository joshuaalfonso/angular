import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { orderDetailsService } from './order-details.service';
import { MessageService, ConfirmEventType, ConfirmationService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [ConfirmationService, MessageService]
})

export class OrderDetailsComponent implements OnInit {

  visible: boolean = false;

  orderDetails!: orderDetail[];

  orderDetailsForm!: FormGroup;

  order_details: any[] = [];

  detailsId: any[] = [];

  customerName: any[] = [];

  itemName: any[] = [];

  item_name: any[] = [];

  totalAmount: number = 0;

  totalQuantity: number = 0;

  date: Date | undefined;
    
  formGroup!: FormGroup ;

  isLoading = false;

  constructor(private http: HttpClient,
    private service: orderDetailsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {

    this.orderDetailsForm = new FormGroup ({
      'order_id': new FormControl(0),
      'order_date': new FormControl(null, Validators.required),
      'customer_name': new FormControl(null, Validators.required),
      'total_quantity': new FormControl(0, Validators.required),
      'total_amount': new FormControl(0, Validators.required)
    })
    
    this.getItem();  

    // this.addOrder();

  }

  // onDelete(data:any) {
  //   this.service.onDeleteItem(data.order_id).subscribe(
  //     response => {
  //       let db_order_details = response;
  //     }
  //   )
  // }
    
  onDelete(data:any) {

    this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
            // this.service.onDeleteItem(data.order_id).subscribe(
            //   response => {
            //     this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Successfully Deleted' });
            //   }
            // )
            this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Successfully Deleted' });
        },
    });
  }

  getItem(){
    this.isLoading = true;

    this.service.getCustomerName().subscribe(
      response => this.customerName = response
    );

    this.service.getItemName().subscribe(
      response => this.itemName = response
    );

    this.service.getOrders().subscribe(
      response => { 
        this.isLoading = false;
        this.orderDetails = response 
      }
    );

  }

  addOrder(){

    let data = {
      order_details_id: 0,
      item_id: 0,
      quantity: 0,
      price: 0,
      amount: 0,
      remarks: ''
    };
    this.order_details.push(data);
  }

  removeOrder(i:any){
    this.order_details.splice(i, 1);
  }

  onSubmit(){
    // console.log(this.orderDetailsForm.value);
    // console.log(this.order_details);

    let authObs: Observable<ResponseData>;
    authObs = this.service.saveData( this.orderDetailsForm.value.order_id,  this.orderDetailsForm.value.order_date.toLocaleDateString(), this.orderDetailsForm.value.customer_name.customer_id, this.order_details, this.totalQuantity, this.totalAmount,  "");

    authObs.subscribe(resData =>{
  
      if( resData === 1){
        this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.orderDetailsForm.value.order_id +  ' successfully recorded', life: 3000 });
        this.getItem();
      }
      else if( resData === 2){
        this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.orderDetailsForm.value.order_id  +  ' successfully updated', life: 3000 });
        this.getItem();
      }
      else if( resData === 0){
        this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.orderDetailsForm.value.order_id +  ' arlready existing', life: 3000 });
      }              
      },
      errorMessage=>{
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
      });
  }


  onSelect(data:any) {

    this.showDialog();

    this.order_details = [];

    this.service.getOrderDetails(data.order_id).subscribe(
      response => {
        let db_order_details = response;

        // console.log(db_order_details);

        for (let index =0; index<= db_order_details.length -1; index++){

          let selected_item;
          let selected_index = 0;

          for (let row_item_id =0; row_item_id<= this.itemName.length -1; row_item_id++){
            if(db_order_details[index].item_id == this.itemName[row_item_id].item_id){
              selected_item = this.itemName[row_item_id];    
              selected_index = row_item_id;    
              break;
            }
          }

          // selected_item.price= db_order_details[index].price;

          // // console.log(this.itemName[selected_index]);

          // selected_item ={
          //   item_id: this.itemName[selected_index].item_id,
          //   item_code: this.itemName[selected_index].item_code,
          //   item_name: this.itemName[selected_index].item_name,
          //   price: db_order_details[index].price,
          //   unit_id: this.itemName[selected_index].unit_id,
          //   unit_code: this.itemName[selected_index].unit_code,
          // }

          // console.log(selected_item);


          let data = {
            order_details_id: db_order_details[index].order_details_id,
            item_id: selected_item,
            quantity: db_order_details[index].quantity,
            price: db_order_details[index].price,
            amount: 0,
            remarks: db_order_details[index].remarks
          };
          this.order_details.push(data);

        }

        this.computeAmount();

      });


    var customer_value ={};
    
    for(let index=0; index<= this.customerName.length -1; index++){
      if(this.customerName[index].customer_id == data.customer_id ){
        customer_value = this.customerName[index];   
        break;
      }
    }

      this.orderDetailsForm.setValue({
      order_id: data.order_id,
      order_date: new Date(data.order_date),
      customer_name: customer_value,
      total_quantity: data.total_quantity,
      total_amount: data.total_amount
    });

     this.totalAmount = data.total_amount;
     this.totalQuantity = data.total_quantity;   

    // console.log(data)
  }

  computeAmount() {
    this.totalAmount = 0;
    this.totalQuantity = 0;

    for (let index= 0; index <= this.order_details.length-1; index++) {

      if (this.order_details[index].quantity != undefined && this.order_details[index].quantity != 0 && 
          this.order_details[index].price != undefined && this.order_details[index].price != null)  
      {
          
          this.order_details[index].amount = this.order_details[index].quantity * this.order_details[index].price;

          this.totalAmount = parseFloat(this.order_details[index].amount) + this.totalAmount;
          this.totalQuantity = parseFloat(this.order_details[index].quantity) + this.totalQuantity;
      }
      else 
      {
        console.log('error')
      }
   
    }
  }

  onSelectedItem(index:any){    
    this.order_details[index].price = this.order_details[index].item_id.price
  }

  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

  onInsert(){

    this.order_details = [];

    this.addOrder();
    this.showDialog();
  }

  showDialog() {
    this.visible = true;
    this.orderDetailsForm.reset()  
    this.totalAmount = 0;
    this.totalQuantity = 0;   
  }

}

interface orderDetail {
  order_details_id: string;
  order_id: string;
  item_id: string;
  quantity: number;
  price: number;
  remarks: string;
  // remarks: string;
}

interface ResponseData{

}

