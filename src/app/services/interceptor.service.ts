import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public utility: UtilityService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.callToken()).pipe(
      switchMap(token => {
        const cloneRequest = this.addSecret(req, token);
        return next.handle(cloneRequest);
      })
    );

  }

  callToken() {
    return new Promise(resolve => {

      let token = localStorage.getItem('token');
      resolve(token);
      // this.sqlite.getCurrentUserAuthorizationToken().then( v => {
      //   // console.log("token must be here", v);
      //   resolve(v);
      // }).catch( err => {
      //   console.error(err);
      //   resolve(null)
      // });

    });
  }

  // private addSecret(request: HttpRequest<any>, value: any){
  //   let v = value ? value : '';
  //   let clone = request.clone({
  //     setHeaders : {
  //       Authorization: 'Bearer ' + v,
  //       Accept: "*",
  //       'Content-Type': "application/json",
  //       'X-Requested-With': 'XMLHttpRequest'
  //     }
  //   })
  //   return clone;
  // }

  private addSecret(request: HttpRequest<any>, value: any) {

    let v = value ? value : localStorage.getItem('token');

    let obj = {
      Authorization: 'Bearer ' + v
    }


    obj['Accept'] = 'application/json';
    let cnt = request.headers.get('Content-Type');
    if (cnt == 'application/json') {
      obj['Content-Type'] = request.headers.get('Content-Type');
    }

    const clone = request.clone(
      {
        setHeaders: obj
      }
    );

    return clone;
  }
}
