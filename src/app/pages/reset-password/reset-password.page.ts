import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage extends BasePage implements OnInit {

  resetPasswordForm: FormGroup;
  loading = false;
  showForgotpass = false;

  userslimit = 0;
  usertoavail = 0;
  showpackage = false;
  email = '';
  token = '';

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
    this.token = this.nav.getQueryParams()['token']
  }

  setupPasswordForm() {
    const re = /\S+@\S+\.\S+/;
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  setupForm() {
    const re = /\S+@\S+\.\S+/;

    this.resetPasswordForm = this.formBuilder.group({
      password: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      password_confirmation: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
    });


  }

  async submitResetPassword() {
    if (!this.resetPasswordForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    let formdata = this.resetPasswordForm.value;
    formdata = { ...formdata, email: this.email, type: 'app', token: this.token }
    if (formdata && formdata.password === formdata.password_confirmation) {
      console.log('formdata => ', formdata)
      this.loading = true;
      try {
        let res = await this.network.resetPassword(formdata);
        console.log('resetPasswordForm res => ', res);
        if (res && res.data) {
          this.utility.presentSuccessToast('Password reset successfully');
          this.resetPasswordForm.setValue({ password: '', password_confirmation: '' })
          this.nav.navigateTo('pages/login');
        }
      } catch (err) {
        console.log(err);
        this.utility.presentFailureToast('Something Went Wrong');
      } finally {
        this.loading = false;
      }
    } else {
      this.utility.presentFailureToast(`Passwords don't match`);
    }

  }

}
