import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, exhaustMap, take } from "rxjs";
import { authService } from "./auth.service";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: authService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {              
                if (user && user.token) {
                    // const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
                    const modifiedReq = req.clone({ headers:  req.headers.set('x-auth-token', user.token) });
                    return next.handle(modifiedReq);
                } else {
                    return next.handle(req);
                }
            })
            
        );
    }
}
