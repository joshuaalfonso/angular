import { Component, OnDestroy, OnInit } from '@angular/core';
import { authService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  userName: string | null = null;
  userRole: string | null = null;
  isAdmin = false;
  navOpen = false;
  private userSub!: Subscription;

  constructor(private authService: authService){}

  ngOnInit() {
      this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      this.userName = user ? user.username : null;
      this.userRole = user ? user.usl : null;

      if (this.userRole === 'Admin') {
        this.isAdmin = true;
      }
      
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logOut();
  }

  openNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  
}


