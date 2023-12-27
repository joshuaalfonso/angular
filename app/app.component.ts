import { Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { authService } from './auth/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]

})
export class AppComponent implements OnInit {

 showHeader = true;

  constructor(private router: Router,
              private authService: authService) {

    router.events.subscribe(
      (val)=>{
        if(val instanceof NavigationEnd) {
          if(val.url == '/login') {
            this.showHeader = false;
          }
          else {
            this.showHeader =true
          }
        }
      }
    )

  }

  ngOnInit() {
    this.authService.autoLogin();
  }


}