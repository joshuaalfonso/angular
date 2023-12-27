import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { itemService } from './item.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  items!: Item[];

  itemForm!: FormGroup;

  visible: boolean = false;

  isLoading = false;

  unit: any[] = [];
  selectedCountry: string | undefined;

  constructor(private http: HttpClient,
    private itemService: itemService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.itemForm = new FormGroup({
      'id': new FormControl(0),
      'itemCode': new FormControl(null, Validators.required),
      'itemName': new FormControl(null, Validators.required),
      'price': new FormControl(null, Validators.required),
      'unit' : new FormControl(null, Validators.required)
    });

    this.getItem();
  }

  getItem(){
    this.isLoading = true;
    this.itemService.getItemData().subscribe(
      response => { 
        this.items = response 
        this.isLoading = false
      }
      );
    this.itemService.getUnits().subscribe(
      response => this.unit = response 
      );
  }

  onSubmit() {
    // console.log(this.itemForm.value);
    
    let authObs: Observable<ResponseData>;
    authObs = this.itemService.saveData( this.itemForm.value.id, this.itemForm.value.itemCode, this.itemForm.value.itemName, this.itemForm.value.price, this.itemForm.value.unit , "");
  
    authObs.subscribe(resData =>{
        if( resData === 1){
          this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.itemForm.value.itemName +  ' successfully recorded', life: 3000 });
          this.clearItems();
          this.getItem();
        }
        else if( resData === 2){
          this.messageService.add({ severity: 'success', summary: 'Danger', detail: 'Item: ' + this.itemForm.value.itemName +  ' successfully updated', life: 3000 });
          this.clearItems();
          this.getItem();
        }
        else if( resData === 0){
          this.messageService.add({ severity: 'error', summary: 'Danger', detail: 'Item: ' + this.itemForm.value.itemName +  ' arlready existing', life: 3000 });
        }              
        },
        errorMessage=>{
            this.messageService.add({ severity: 'error', summary: 'Danger', detail: errorMessage, life: 3000 });
    });
  }

  showDialog() {
    this.visible = true;
    this.clearItems();
  }

  clearItems(){
    this.itemForm.reset();
  }

  onGlobalFilter(table: Table, event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }

  onSelect(data:any){

    this.visible = true;
  
    var unit_value ={};
    
    for(let index=0; index<= this.unit.length -1; index++){
      if(this.unit[index].unit_id == data.unit_id ){
        unit_value = this.unit[index];   
        break;
      }
    }

    this.itemForm.setValue({
      id: data.item_id,
      itemCode: data.item_code,
      itemName: data.item_name,
      price: data.price,
      unit: unit_value
    })
  
  }

}

interface Item {
  item_id?: number;
  item_code?: string;
  item_name?: string;
  price?: string;
}

interface ResponseData{

}
