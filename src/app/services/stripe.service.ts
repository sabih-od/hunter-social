import { Injectable } from '@angular/core';
import {
  Stripe,
  StripeCardTokenRes,
} from '@awesome-cordova-plugins/stripe/ngx';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  settings: {}
  constructor(
    private stripe: Stripe,    
    public network: NetworkService
    ) {}

  async init() {
    let res = await this.network.getUserSettings();
    if(res && res.data){
      this.settings = res.data;
      const stripe_key = res.data.stripe_is_test_mode == '1' ? res.data.stripe_test_key : res.data.stripe_public_key
      this.stripe.setPublishableKey(
        // 'pk_live_51LphEFDlVwvNPd3Id77f7BuGkVeWudwFty5xGNQeHfF0n28RU0gcR81G2WD8p0udfsxrhZC1fOEVcl5QVeJPsoTy00QvFzcEAj'
        // 'sk_test_lUp78O7PgN08WC9UgNRhOCnr'
        // 'pk_test_0rY5rGJ7GN1xEhCB40mAcWjg'
        stripe_key
      );

    }
    // this.stripe.setPublishableKey(
    //   // 'pk_live_51LphEFDlVwvNPd3Id77f7BuGkVeWudwFty5xGNQeHfF0n28RU0gcR81G2WD8p0udfsxrhZC1fOEVcl5QVeJPsoTy00QvFzcEAj'
    //   // 'sk_test_lUp78O7PgN08WC9UgNRhOCnr'
    //   'pk_test_0rY5rGJ7GN1xEhCB40mAcWjg'
    // );

    
  }

  // async getSetting(){
  //   let res = await this.network.getUserSettings();
  //   if(res && res.data){
  //     this.settings = res.data
  //   }
  // }

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
