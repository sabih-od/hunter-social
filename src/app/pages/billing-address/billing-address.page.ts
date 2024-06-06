import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.page.html',
  styleUrls: ['./billing-address.page.scss'],
})
export class BillingAddressPage extends BasePage implements OnInit {
  aForm: FormGroup;
  cart;
  user;
  constructor(injector: Injector) {
    super(injector);
    this.setupForm();
  }

  get is_shipping_address() {
    return this.getValue('is_shipping_address');
  }

  setupForm() {



    this.aForm = this.formBuilder.group({
      first_name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      last_name: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      is_shipping_address: [true, Validators.compose([Validators.required])],
      email: [this.user?.email, Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      zip: ['', Validators.compose([Validators.required])],
      shipping_address: ['', Validators.compose([])],
      shipping_city: ['', Validators.compose([])],
      shipping_country: ['', Validators.compose([])],
      shipping_state: ['', Validators.compose([])],
      shipping_zip: ['', Validators.compose([])],
    });

    // this.aForm.controls['first_name'].setValue('asdasd')
    // this.aForm.controls['last_name'].setValue('asdasd')
  }
  ngOnInit() {
    this.cart = this.dataService.cart;
    this.users.getUser().then((user) => {
      this.user = user;

      user?.customer?.first_name && this.aForm.controls['first_name'].setValue(user?.customer?.first_name)
      user?.customer?.last_name && this.aForm.controls['last_name'].setValue(user?.customer?.last_name)
      user?.email && this.aForm.controls['email'].setValue(user?.email)
      user?.phone && this.aForm.controls['phone'].setValue(user?.phone)
      user?.addresses?.BILLING?.address1 && this.aForm.controls['address'].setValue(user?.addresses?.BILLING?.address1)
      user?.addresses?.BILLING?.state && this.aForm.controls['state'].setValue(user?.addresses?.BILLING?.state)
      user?.addresses?.BILLING?.city && this.aForm.controls['city'].setValue(user?.addresses?.BILLING?.city)
      user?.addresses?.BILLING?.country && this.aForm.controls['country'].setValue(user?.addresses?.BILLING?.country)
      user?.addresses?.BILLING?.postcode && this.aForm.controls['zip'].setValue(user?.addresses?.BILLING?.postcode)


    });
  }

  async proceed() {
    this.validate();
    if (this.aForm.valid) {
      let data = {
        ...this.aForm.value,
        billing: {
          address: this.getValue('address'),
          city: this.getValue('city'),
          country: this.getValue('country'),
          state: this.getValue('state'),
          zip: this.getValue('zip'),
        },
        shipping: {
          address: this.getValue('shipping_address'),
          city: this.getValue('shipping_city'),
          country: this.getValue('shipping_country'),
          state: this.getValue('shipping_state'),
          zip: this.getValue('shipping_zip'),
        },
      };
      delete data.address;
      delete data.city;
      delete data.country;
      delete data.state;
      delete data.zip;

      delete data.shipping_address;
      delete data.shipping_city;
      delete data.shipping_country;
      delete data.shipping_state;
      delete data.shipping_zip;

      let res = await this.network.checkOut(data);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);

        Browser.open({ url: res.data.url });
        this.nav.push('pages/home');
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    } else {
      this.utility.presentFailureToast('Please fill all the data properly');
    }
  }

  validate() {
    let isSame = this.getValue('is_shipping_address');
    if (isSame) return;

    this.aForm.controls['shipping_address'].setValidators([
      Validators.required,
    ]);
    this.aForm.controls['shipping_city'].setValidators([Validators.required]);
    this.aForm.controls['shipping_country'].setValidators([
      Validators.required,
    ]);
    this.aForm.controls['shipping_state'].setValidators([Validators.required]);
    this.aForm.controls['shipping_zip'].setValidators([Validators.required]);
  }

  getValue(val) {
    return this.aForm.get(val).value;
  }
}
