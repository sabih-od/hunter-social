import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-submit',
  templateUrl: './otp-submit.page.html',
  styleUrls: ['./otp-submit.page.scss'],
})
export class OtpSubmitPage extends BasePage implements OnInit {

  otpForm: FormGroup;
  loading = false;
  showForgotpass = false;

  userslimit = 0;
  usertoavail = 0;
  showpackage = false;
  email = '';

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'main');
  }

  ngOnInit() {
    // this.getSetting();
    this.setupForm();
    this.email = this.nav.getQueryParams()['email']
    console.log('this.email => ', this.email)
  }

  setupForm() {
    const re = /\S+@\S+\.\S+/;

    this.otpForm = this.formBuilder.group({
      otp: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.required,
        ]),
      ],
    });


  }

  async resendOTP() {

    const data = { email: this.email, type: 'app' }
    try {
      const res = await this.network.forgotPassword(data);
      this.utility.presentSuccessToast('New OTP sent on your email');
    } catch (err) {
      console.log(err);
      this.utility.presentFailureToast('Wrong Email');
    }
  }

  async submitOTP() {
    if (!this.otpForm.valid) {
      this.utility.presentFailureToast(`Provide valid OTP sent on ${this.email}`);
      return;
    }

    let formdata = this.otpForm.value;
    formdata = { ...formdata, email: this.email, type: 'app' }
    console.log('formdata => ', formdata)
    this.loading = true;
    try {
      let res = await this.network.submitOTP(formdata);
      console.log('submitOTP res => ', res)
      if (res && res.data) {
        this.nav.navigateTo('pages/reset-password', { queryParams: { email: res.data.email, token: res.data.token } });
        // this.utility.presentSuccessToast('Password reset successfully');
        this.otpForm.setValue({ otp: '' })
      }
    } catch (err) {
      console.log(err);
      this.utility.presentFailureToast('Something Went Wrong');
    } finally {
      this.loading = false;
    }
  }
}
