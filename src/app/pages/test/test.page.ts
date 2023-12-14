import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplePayEventsEnum, PaymentFlowEventsEnum, PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { first, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;

  constructor(private platform: Platform, private http: HttpClient) {
    if (Capacitor.isPluginAvailable("Stripe")) {
      Stripe.initialize({
        publishableKey: environment.stripe.publishableKey
      });
    }
  }
  ngOnInit() {
  }

  data = {
    name: 'John Martin',
    email: 'johnmartin@mailinator.com',
    amount: 120.00,
    currency: 'usd'
  }


  async subscribe() {
    try {

      const data$ = await this.http.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.api + 'subscription', this.data).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$)

      console.log('paymentIntent => ', paymentIntent)

    } catch (err) {
      console.log('err => ', err)
    }
  }

  async paymentSheet() {
    try {

      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const data$ = await this.http.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.api + 'payment-sheet', this.data).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$)

      console.log('paymentIntent => ', paymentIntent)

      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Ionic Test App'
      });

      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      console.log('result => ', result)
      if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
      }

    } catch (err) {
      console.log('err => ', err)
    }
  }

  async paymentFlow() {
    try {
      // be able to get event of PaymentFlow
      Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
        console.log('PaymentFlowEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const data$ = await this.http.post<{ paymentIntent: string; ephemeralKey: string; customer: string; }>(environment.api + 'payment-sheet', this.data).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$);
      console.log('paymentIntent => ', paymentIntent)
      console.log('ephemeralKey => ', ephemeralKey)
      console.log('customer => ', customer)

      // Prepare PaymentFlow with CreatePaymentFlowOption.
      const createFlow = await Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        // setupIntentClientSecret: setupIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
      });

      // // Present PaymentFlow. **Not completed yet.**
      const presentResult = await Stripe.presentPaymentFlow();
      console.log('presentResult => ', presentResult); // { cardNumber: "●●●● ●●●● ●●●● ****" }

      // // Confirm PaymentFlow. Completed.
      const confirmResult = await Stripe.confirmPaymentFlow();
      console.log('confirmResult => ', confirmResult);
      if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
        // Happy path
      }
    } catch (err) {
      console.log('err => ', err)
    }
  }

  async applePay() {
    // Check to be able to use Apple Pay on device
    const isAvailable = Stripe.isApplePayAvailable().catch(() => undefined);
    if (isAvailable === undefined) {
      // disable to use Google Pay
      return;
    }

    // be able to get event of Apple Pay
    Stripe.addListener(ApplePayEventsEnum.Completed, () => {
      console.log('ApplePayEventsEnum.Completed');
    });

    // Connect to your backend endpoint, and get paymentIntent.
    const data$ = await this.http.post<{
      paymentIntent: string;
    }>(environment.api + 'payment-sheet', this.data).pipe(first());

    const { paymentIntent } = await lastValueFrom(data$);

    // Prepare Apple Pay
    await Stripe.createApplePay({
      paymentIntentClientSecret: paymentIntent,
      paymentSummaryItems: [{
        label: 'Order ID #74832332',
        amount: 100.00
      }],
      merchantIdentifier: 'rdlabo',
      countryCode: 'US',
      currency: 'USD',
    });

    // Present Apple Pay
    const result = await Stripe.presentApplePay();
    if (result.paymentResult === ApplePayEventsEnum.Completed) {
      // Happy path
    }
  }


}
