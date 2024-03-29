import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { PLAN_TYPE } from 'src/app/data/const/enums';
import { StringsService } from 'src/app/services/basic/strings.service';
import { BasePage } from '../base-page/base-page';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { PrivacyPage } from '../privacy/privacy.page';
import { TermsConditionsPage } from '../terms-conditions/terms-conditions.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends BasePage implements OnInit, AfterViewInit {
  signupObj = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    gender: 'm',
    package_id: 1,
  };

  isIOS = false;

  loading = false;

  aForm: FormGroup;
  packages: any;

  submitted = false;
  canMakePayments = false;
  items: any = [
    {
      label: 'Free - $0/Month',
      amount: 0,
    },
    {
      label: 'Gold - $9.95/Month',
      amount: 9.95,
    },
    {
      label: 'Platinum - $31.95/Month',
      amount: 31.95,
    },
  ];

  shippingMethods: any = [];
  supportedNetworks: any = ['visa', 'amex'];
  merchantCapabilities: any = ['3ds', 'debit', 'credit'];
  merchantIdentifier: string = 'merchant.com.huntersocial.app';
  currencyCode: string = 'USD';
  countryCode: string = 'US';
  billingAddressRequirement: any = ['name', 'email', 'phone'];
  shippingAddressRequirement: any = 'none';
  shippingType: string = 'online';

  constructor(
    injector: Injector,
    public alertController: AlertController,
    public platform: Platform
  ) {
    super(injector);
    this.isIOS = Capacitor.getPlatform() == 'ios';
    this.setupForm();
  }
  ngAfterViewInit(): void {
    // document.getElementById('package').onchange = function (ev) {
    //   console.log(ev);
    // };
  }

  setupForm() {
    const re = /\S+@\S+\.\S+/;

    this.aForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      // phone: ['', Validators.compose([Validators.required])],
      password: [
        '',
        Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      password_confirmation: [
        '',
        Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      // pay_apple: [false],
    });
  }

  ngOnInit() {
    this.packages = [
      {
        id: 1,
        name: 'Free - $0/Month',
      },
      {
        id: 2,
        name: 'Gold - $9.95/Month',
      },
      {
        id: 3,
        name: 'Platinum - $31.95/Month',
      },
    ];
  }

  async singUp() {
    // return;
    // this.nav.navigateTo('home');

    // if (this.aForm.controls['pay_apple'].value) {
    // this.nav.push('pages/apple-wallet', {
    //   package_id: this.signupObj.package_id,
    //   shouldRedirect: false,
    // });

    if (this.aForm.invalid) {
      console.log(this.aForm.errors);
      this.utility.presentFailureToast('Please fill all fields properly');
      return;
    }

    const formdata = {
      ...this.aForm.value,
      package_id: PLAN_TYPE.FREE, // Always Free it will be updated with stripe payment page
      //  password_confirmation: this.aForm.value['password'],
    };

    console.log(formdata);
    localStorage.setItem('userDataa', JSON.stringify(formdata));

    // formdata['phone'] = '+1' + this.strings.getOnlyDigits(formdata['phone']);

    // console.log(formdata);

    this.loading = true;

    const res = await this.network.register(formdata);
    console.log(res);

    var token = null;
    if (res?.data?.user?.token) {
      token = res.data.user.token;
      localStorage.setItem('token', token);
    }

    if (res) {
      if (this.signupObj.package_id != PLAN_TYPE.FREE) {
        // let _res = null;
        let _res = await this.network.getUser();
        this.users.setUser(_res.data.user);

        // if (_res) {
        if (Capacitor.getPlatform() == 'ios') {
          // if (this.aForm.controls['pay_apple'].value) {
          this.nav.push('pages/apple-wallet', {
            package_id: this.signupObj.package_id,
            shouldRedirect: true,
          });
          // this.wallet();
          return;
        } else {
          this.nav.push('pages/stripe-payment', {
            package_id: this.signupObj.package_id,
            shouldRedirect: true,
          });
        }
      } else {
        console.log('freee');
        let _res = await this.network.getUser();
        this.users.setUser(_res.data.user);
        this.utility.presentSuccessToast('Success');
        // this.nav.navigateTo('home');
        this.nav.push('pages/home');
        this.menuCtrl.enable(true, 'main');
      }
    }
    //   else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    // return;

    // if (data) {
    //   const res = await localStorage.setItem('token', data.token);
    //   if (res) {
    //     this.modals.dismiss({ data: res });
    //   }
    //   // await Browser.open({ url: `https://dev-veenme.thesupportonline.net/testtoken/${data.token}` });
    // }

    this.loading = false;
  }

  onTelephoneChange(ev) {
    if (ev.inputType !== 'deleteContentBackward') {
      const utel = this.utility.onkeyupFormatPhoneNumberRuntime(
        ev.target.value,
        false
      );
      console.log(utel);
      ev.target.value = utel;
      this.aForm.controls['phone'].patchValue(utel);
      // ev.target.value = utel;
    }
  }

  openLogin() {
    this.nav.pop();
  }

  onPackageSelected(value) {
    console.log(value);
    this.signupObj.package_id = value;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Hunter Social Apple Pay',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async privacyPolicy() {
    // await Browser.open({ url: `https://hunterssocial.com/privacy` });
        await this.modals.present(PrivacyPage);



  }

  async TermofUse() {
    // await Browser.open({
    //   url: `https://hunterssocial.com/terms`,
    // });
     await this.modals.present(TermsConditionsPage);
  }

  // packageChanged($event) {
  //   console.log(params);
  // }
}
