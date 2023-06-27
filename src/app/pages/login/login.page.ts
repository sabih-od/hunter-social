import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { BasePage } from '../base-page/base-page';
import { SignupPage } from '../signup/signup.page';
// import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Capacitor } from '@capacitor/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ViewWillEnter } from '@ionic/angular';
import { resolve } from 'dns';
import { Config } from 'src/app/config/main.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePage implements OnInit, ViewWillEnter {
  aForm: FormGroup;
  feedbackForm: FormGroup;
  loading = false;
  showForgotpass = false;

  userslimit = 0;
  usertoavail = 0;
  showpackage = false;

  constructor(
    injector: Injector,
    // private googlePlus: GooglePlus,
    private iab: InAppBrowser
  ) {
    super(injector);
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'main');
  }

  ngOnInit() {
    this.getSetting();
    this.setupForm();
  }

  setupPasswordForm() {
    const re = /\S+@\S+\.\S+/;
    this.aForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  setupForm() {
    const re = /\S+@\S+\.\S+/;

    this.aForm = this.formBuilder.group({
      email: [
        '', //test@test.com
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        '', // 12345678
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
    });

    this.feedbackForm = this.formBuilder.group({
      comment: ['', Validators.compose([Validators.required, Validators.minLength(10)]),],
    });

  }

  openSignup() {
    this.nav.navigateTo('pages/signup');
  }

  async login() {
    // this.nav.push('pages/tabbar');
    if (!this.aForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    const formdata = this.aForm.value;
    this.loading = true;
    let res = await this.network.login(this.aForm.value);
    console.log('login res => ', res);
    if (res && res.data) {
      this.users.setToken(res.data.token);
      this.users.setUser(res.data);
      console.log('LOGIN_SUCCESS', res.data);

      this.aForm.setValue({ email: '', password: '' })

      this.nav.push('pages/home');
      this.events.publish('USER_DATA_RECEIVED');
      this.events.publish('ROUTE_CHANGED');
      this.menuCtrl.enable(true, 'main');
    } else
      if (res?.error?.message != 'Unauthenticated.') {
        this.utility.presentFailureToast(
          res?.error?.message ?? 'Something went wrong'
        );
      }
    return;

    const user = await this.users.login(formdata);

    if (user) {
      alert('Success');
      this.nav.push('pages/selection');
      // this.openWebview();
    } else {
    }
    this.loading = false;
  }

  showForgotPassword() {
    this.showForgotpass = true;
    this.setupPasswordForm();
  }

  async forgetPassword() {
    const formdata = this.aForm.value;
    console.log(formdata);
    try {
      const res = await this.network.forgotPassword(formdata);
      this.showForgotpass = false;
      console.log(res);
      this.utility.presentSuccessToast('Email sent Successfullty');
    } catch (err) {
      console.log(err);
      this.utility.presentFailureToast('Wrong Email');
    }
  }

  async getSetting() {
    let res = await this.network.getSettings();
    if (res) {
      this.userslimit = res.data.lifetime_users_limit;
      this.usertoavail = 5000 - this.userslimit
      if (this.userslimit == 0) {
        this.showpackage = true;
      }
    }
  }

  showLoginSignup() {
    this.showForgotpass = false;
    this.setupForm();
  }

  async submitFeedback() {
    if (!this.feedbackForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    const formdata = this.feedbackForm.value;
    this.loading = true;
    let res = await this.network.feedback(this.feedbackForm.value);
    console.log('feedback res => ', res);
    if (res && res.data) { 
      this.utility.presentSuccessToast('Feedback sent successfully');
      this.feedbackForm.setValue({ comment: '' })
    }

  }

  // async facebookLogin() {
  //   await FirebaseAuthentication.signInWithFacebook();
  // }

  // async loginWithGoogle() {
  //   console.log('loginWithGoogle');

  //   try {
  //     this.googlePlus
  //       .login({})
  //       .then((resResult) => {
  //         console.log('loginWithGoogle', resResult);

  //         if (resResult && resResult.email) {
  //           let res = {
  //             user: {
  //               displayName: resResult['displayName']
  //                 ? resResult['displayName']
  //                 : resResult['userId'],
  //               email: resResult['email'],
  //               uid: resResult['userId'],
  //             },
  //           };
  //           alert('Success: ' + res.user.displayName);

  //           //this.signUpwithSocial(res, 'google');
  //         }
  //       })
  //       .catch((e) => {
  //         alert('Failed: ' + e.toString());
  //       }); // { user: null };
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // async loginWithFacebook() {
  //   try {
  //     const FACEBOOK_PERMISSIONS = [
  //       'email',
  //       'user_birthday',
  //       'user_photos',
  //       'user_gender',
  //     ];

  //     var accessToken = null;
  //     var result = await FacebookLogin.getCurrentAccessToken();

  //     console.log(result);

  //     if (!result || !result.accessToken) {
  //       result = await FacebookLogin.login({
  //         permissions: FACEBOOK_PERMISSIONS,
  //       });

  //       if (result.accessToken) {
  //         // Login successful.
  //         console.log(`Facebook access token is ${result.accessToken.token}`);

  //         accessToken = result.accessToken;
  //       }
  //     } else {
  //       accessToken = result.accessToken;
  //     }

  //     const resResult = await FacebookLogin.getProfile({
  //       fields: ['id', 'name', 'email', 'gender'],
  //     });

  //     console.log('Facebook user is', resResult);

  //     let res = {
  //       user: {
  //         displayName: resResult['name'] ? resResult['name'] : resResult['id'],
  //         email: resResult['email']
  //           ? resResult['email']
  //           : resResult['id'] + '@email.com',
  //         uid: resResult['id'],
  //         dob: new Date(2003, 1, 1, 0, 0, 0, 0).toUTCString(),
  //       },
  //     };

  //     console.log(res);
  //     if (res) {
  //       alert(res);
  //       // this.signUpwithSocial(res, 'fb');
  //       // await Browser.open({ url: `https://dev-veenme.thesupportonline.net/testtoken/${token}` });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  openWebview() {
    const browser = this.iab.create(Config.URL + 'public/', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }
}
