import { Injectable } from '@angular/core';
import {
  Stripe,
  StripeCardTokenRes,
} from '@awesome-cordova-plugins/stripe/ngx';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  constructor(private stripe: Stripe) {}

  init() {
    this.stripe.setPublishableKey(
      'pk_live_51LphEFDlVwvNPd3Id77f7BuGkVeWudwFty5xGNQeHfF0n28RU0gcR81G2WD8p0udfsxrhZC1fOEVcl5QVeJPsoTy00QvFzcEAj'
    );

    console.log('Init');
  }

  makePayment(card) {
    return new Promise<StripeCardTokenRes>((resolve, reject) => {
      // let card = {
      //   number: '4242424242424242',
      //   expMonth: 12,
      //   expYear: 2023,
      //   cvc: '220',
      // };

      this.stripe
        .createCardToken(card)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
