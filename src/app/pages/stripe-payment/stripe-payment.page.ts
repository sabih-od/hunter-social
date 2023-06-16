import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { StripeService } from 'src/app/services/stripe.service';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.page.html',
  styleUrls: ['./stripe-payment.page.scss'],
})
export class StripePaymentPage extends BasePage implements OnInit {
  aForm: FormGroup;

  data = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  };
  //submitted = false;
  //canMakePayments = false;
  //items: any = [
  //  {
  //    label: 'Free - $0/Month',
  //    amount: 0,
  //  },
  //  {
  //    label: 'Gold - $9.95/Month',
  //    amount: 9.95,
  //  },
  //  {
  //    label: 'Platinum - $31.95/Month',
  //    amount: 31.95,
  //  },
  //];
//
  //shippingMethods: any = [
  //  {
  //    identifier: 'NextDay',
  //    label: 'NextDay',
  //    detail: 'Arrives tomorrow by 5pm.',
  //    amount: 3.99,
  //  },
  //  {
  //    identifier: 'Standard',
  //    label: 'Standard',
  //    detail: 'Arrive by Friday.',
  //    amount: 4.99,
  //  },
  //  {
  //    identifier: 'SaturdayDelivery',
  //    label: 'Saturday',
  //    detail: 'Arrive by 5pm this Saturday.',
  //    amount: 6.99,
  //  },
  //];
  //supportedNetworks: any = ['visa', 'amex'];
  //merchantCapabilities: any = ['3ds', 'debit', 'credit'];
  //merchantIdentifier: string = 'merchant.com.huntersocial.app';
  //currencyCode: string = 'GBP';
  //countryCode: string = 'GB';
  //billingAddressRequirement: any = ['name', 'email', 'phone'];
  //shippingAddressRequirement: any = 'none';
  //shippingType: string = 'shipping';
  constructor(injector: Injector, public stripe: StripeService,) {
    super(injector);
    //this.subscribe();
  }

  ngOnInit() {
    this.stripe.init();
    this.setupForm();
  }

  setupForm() {
    this.aForm = this.formBuilder.group({
      card_number: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(16),
        ]),
      ],
    });
  }

  get cardNumber() {
    return this.aForm.get('card_number');
  }

  async submit() {
    if (
      this.notIsNullOrEmpty(this.data.number) &&
      this.notIsNullOrEmpty(this.data.expMonth) &&
      this.notIsNullOrEmpty(this.data.expYear) &&
      this.notIsNullOrEmpty(this.data.cvc)
    ) {
      this.utility.showLoader();
      this.stripe
        .makePayment(this.data)
        .then((res) => {
          let data = {
            token: res.id,
          };
          this.utility.hideLoader();
          console.log('TOKEN is', res.id);

          //this.updatePackageOnServer();
          this.updateMemberShipPayment(res.id);
          // this.utility.presentSuccessToast('Success');
        })
        .catch((err) => {
          // this.updateMemberShipPayment('123');
          this.utility.hideLoader();
          console.log('Error', err);
          this.utility.presentFailureToast(err);
        });
    } else this.utility.presentFailureToast('Please fill all fields');

    // this.aForm.invalid()
  }

  async updatePackageOnServer() {
    let user = await this.users.getUser();
    let pkgId = this.nav.getQueryParams().package_id;

    let res = await this.network.updateMemership(user.id, 1, pkgId);
    console.log('updatePackageOnServer', res);
  }

  async updateMemberShipPayment(id) {
    let user = await this.users.getUser();
    let { package_id, shouldRedirect } = this.nav.getQueryParams();
    let res = await this.network.updateMemershipPayment(
      user.email,
      package_id,
      id
    );
    console.log('updatePackageOnServer', res);
    if (res && res.data) {
      let _res = await this.network.getUser();
      console.log('User', _res);
      if (_res && _res.data && _res.data.user) {
        this.users.setUser(_res.data.user);
        console.log('Updating User');
        this.utility.presentSuccessToast('Package updated successfully!');
        this.utility.hideLoader();
        if (!shouldRedirect) {
          this.nav.pop();
        } else {
          this.nav.push('pages/home');
          this.events.publish('USER_DATA_RECEIVED');
          this.events.publish('ROUTE_CHANGED');
          this.menuCtrl.enable(true, 'main');
        }
      } else {
        this.utility.hideLoader();
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
      }
    } else {
      this.utility.hideLoader();
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }

  onChanged(ev, type) {
    if (ev.inputType !== 'deleteContentBackward') {
      const utel = this.strings.getOnlyDigits(ev.target.value);
      console.log(utel);

      if (!isNaN(parseInt(utel))) {
        ev.target.value = utel;
        this.data[type] = utel;
      } else {
        ev.target.value = '';
        this.data[type] = '';
      }

      // ev.target.value = utel;
    }
  }

  notIsNullOrEmpty(value) {
    return value != null && value != undefined && value != '';
  }

 


  
}
