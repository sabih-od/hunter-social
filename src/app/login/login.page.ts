import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
// import { FirebaseAuthentication } from '@robingenz/capacitor-firebase-authentication';
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Capacitor } from '@capacitor/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ViewWillEnter } from '@ionic/angular';
import { resolve } from 'dns';
import { Config } from 'src/app/config/main.config';
import { StatusBar, Style } from '@capacitor/status-bar';
import { BasePage } from '../pages/base-page/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePage implements OnInit, ViewWillEnter {
  aForm: FormGroup;
  forgetPasswordForm: FormGroup;
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
    if (Capacitor.getPlatform() !== 'web') { this.setStatusBarStyleDark() }
  }

  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  setupPasswordForm() {
    const re = /\S+@\S+\.\S+/;
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  setupForm() {
    const re = /\S+@\S+\.\S+/;

    this.aForm = this.formBuilder.group({
      email: [
        // '',
        // 'testuser08@mailinator.com',
        'sarahthompson@mailinator.com',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        // '',
        '12345678',
        Validators.compose([
          // Validators.minLength(6),
          // Validators.maxLength(30),
          Validators.required,
        ]),
      ],
    });

    // this.feedbackForm = this.formBuilder.group({
    //   comment: ['', Validators.compose([Validators.required, Validators.minLength(10)]),],
    // });

  }

  openSignup() {
    this.nav.navigateTo('pages/signup');
  }

  async login() {
    // this.nav.push('pages/tabbar');
    console.log('this.aForm.controls => ', this.aForm.controls)
    if (this.aForm.controls.email?.errors?.required) {
      this.utility.presentFailureToast('Email field is required');
      return;
    }
    if (this.aForm.controls.email?.errors?.email) {
      this.utility.presentFailureToast('Please privde a valid email');
      return;
    }
    if (this.aForm.controls.password?.errors?.required) {
      this.utility.presentFailureToast('Please privde a valid password');
      return;
    }
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
      const fcmtoken = localStorage.getItem('fcm_token')
      console.log('login fcm_token => ', fcmtoken)
      if (Capacitor.getPlatform() !== 'web') {
        await this.network.setFcmToken(fcmtoken);
      }
      let userRes = await this.network.getUserProfile(res.data?.id);
      console.log('userRes a => ', userRes)
      this.users.setUser({ ...userRes.data, profile_image: this.image.getImageUrl(userRes?.data?.profile_image) });
      this.users.updateUserProfile({ ...userRes.data, profile_image: this.image.getImageUrl(userRes?.data?.profile_image) })
      // this.users.updateUserProfile(res.data)
      localStorage.setItem('user', JSON.stringify({ ...userRes.data, profile_image: this.image.getImageUrl(userRes?.data?.profile_image) }));
      this.users.getNotificationCount()
      this.getStates();
      this.getInterests();
      this.getTagQuestions();
      this.getEthnicities();
      console.log('LOGIN_SUCCESS', res.data.data);

      this.aForm.setValue({ email: '', password: '' })

      localStorage.setItem('isLoggedIn', 'true');
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
    this.loading = false;
    return;

    const user = await this.users.login(formdata);

    if (user) {
      alert('Success');
      this.nav.push('pages/selection');
      // this.openWebview();
    } else {
    }
  }

  async getTagQuestions() {
    const res = await this.network.getQuestions();
    console.log('tagQuestions', res);
    this.users.updateTagQuestions(res && res.data ? res.data : [])
  }

  async getEthnicities() {
    const res = await this.network.getQuestions();
    const ethnicities = ['Alaska Native', 'Asian', 'African American', 'Hispanic', 'Native Hawaiian', 'White'];
    console.log('ethnicities', res);
    this.users.updateEthnicities(ethnicities)
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log('States', res);
    this.users.updateStates(res && res.data ? res.data : [])
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log('interestsList', res);
    this.users.interestsList = res.data
  }

  showForgotPassword() {
    this.showForgotpass = true;
    this.setupPasswordForm();
  }

  passwordType: string = 'password'; // Initial password type is set to 'password'
  passwordIcon: string = 'eye'; // Initial icon is set to 'eye-off'
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-slash' ? 'eye' : 'eye-slash';
  }

  async forgetPassword() {
    if (!this.forgetPasswordForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }
    let formdata = this.forgetPasswordForm.value;
    formdata = { ...formdata, type: 'app' }
    console.log(formdata);
    try {
      this.loading = true;
      const res = await this.network.forgotPassword(formdata);
      this.showForgotpass = false;
      console.log(res);
      this.utility.presentSuccessToast('OTP sent on your email');
      this.nav.navigateTo('pages/otp-submit', { queryParams: { email: formdata.email } });
    } catch (err) {
      console.log(err);
      this.utility.presentFailureToast('Wrong Email');
    } finally {
      this.loading = false;
    }
  }

  async getSetting() {
    let res = await this.network.getSettings();
    if (res) {
      this.userslimit = res?.data?.lifetime_users_limit ? res?.data?.lifetime_users_limit : 0;
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

  // async submitFeedback() {
  //   if (!this.feedbackForm.valid) {
  //     this.utility.presentFailureToast('Pleae fill all fields properly');
  //     return;
  //   }

  //   const formdata = this.feedbackForm.value;
  //   this.loading = true;
  //   let res = await this.network.feedback(this.feedbackForm.value);
  //   console.log('feedback res => ', res);
  //   if (res && res.data) { 
  //     this.utility.presentSuccessToast('Feedback sent successfully');
  //     this.feedbackForm.setValue({ comment: '' })
  //   }

  // }

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
