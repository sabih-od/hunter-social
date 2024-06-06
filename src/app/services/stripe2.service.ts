// stripe.service.ts
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  stripePromise = loadStripe(environment.stripe.publishableKey);

  getStripe() {
    return this.stripePromise;
  }
}


// @Injectable({
//   providedIn: 'root',
// })
// export class StripeService {
//   stripe
//   constructor() {
//     this.init()
//   }
//   getStripe() {
//     return this.stripe;
//   }

//   async init() {
//     this.stripe = await loadStripe(environment.stripe.publishableKey);
//   }

//   createToken() {
//     this.stripe.createToken()
//   }
// }