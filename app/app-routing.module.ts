import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { ItemComponent } from './item/item.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { UsersComponent } from './users/users.component';
import { roleGuard } from './auth/role.guard';
import { PasswordComponent } from './password/password.component';

const routes: Routes = [
  {path: '', redirectTo: '/customer', pathMatch: 'full'},
  {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard]},
  {path: 'item', component: ItemComponent, canActivate: [AuthGuard]},
  {path: 'order-details', component: OrderDetailsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard, roleGuard], data: {role: 'Admin'} },
  {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]},
  {path: 'login', component: AuthComponent}
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
