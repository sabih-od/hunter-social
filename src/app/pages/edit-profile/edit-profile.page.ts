import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Platform, ViewWillEnter } from '@ionic/angular';
import { PLAN_TYPE } from 'src/app/data/const/enums';
import { StripeService } from 'src/app/services/stripe.service';
import { BasePage } from '../base-page/base-page';
import { StripePaymentPage } from '../stripe-payment/stripe-payment.page';
import { Browser } from '@capacitor/browser';
import { PrivacyPage } from '../privacy/privacy.page';
import { TermsConditionsPage } from '../terms-conditions/terms-conditions.page';

import { IAPProduct, InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { Capacitor } from '@capacitor/core';

const PRODUCT_GOLD_KEY = 'com.hunterssocial.app.gold_package_n1';
const PRODUCT_PLATINUM_KEY = 'com.hunterssocial.app.platinum_package_n1';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage extends BasePage implements OnInit, ViewWillEnter {
  user: any = {
    profile_detail: {},
  };
  user_image;
  _img;
  isProfile = true;
  passwords = {
    current_password: '',
    password: '',
    password_confirmation: '',
    package: '',
  };

  search;
  list = [];
  states = [];
  cities = [];
  city;
  state;
  dob;
  interests = [];
  package = [];
  view_type = 1;
  selected_package = 1;
  new_package = 1;


  products: IAPProduct[] = [];

  constructor(
    injector: Injector,
    public stripe: StripeService,
    public platform: Platform,
    private store: InAppPurchase2,
    private ref: ChangeDetectorRef,
  ) {
    super(injector);
  }
  ionViewWillEnter(): void {
    if (this.user) this.getUser();
    console.log('this.user => ', this.user);
  }

  async ngOnInit() {
    this.stripe.init();
    this.initialize();
    this.package = [
      {
        id: 1,
        price: '$0/Month',
        name: 'Free',
      },
      {
        id: 2,
        price: '$9.95/Month',
        name: 'Gold',
      },
      {
        id: 3,
        price: '$31.95/Month',
        name: 'Platinum',
      },
    ];
    this.getStates();
    this.getInterests();
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log('States', res);

    this.states = res && res.data ? res.data : [];
    this.getUser();
  }

  dateTimeUpdated(ev) {
    console.log('ev.detail.value => ', ev.detail.value)
    const dateObject = new Date(ev.detail.value);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    // this.dob = formattedDate;
    this.user['dob'] = formattedDate;
  }

  async getUser() {
    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
      console.log('this.user => ', this.user);
      this.selected_package = this.user.profile_detail.package_id;
      this.new_package = this.user.profile_detail.package_id;
      this.state = parseInt(this.user.profile_detail.state);
      this.dob = this.user.profile_detail.dob
      this.getCities(this.user.profile_detail.state);
      this.user.interests =
        this.dataService.user_data?.user_interests?.map((x) => x.title) ?? [];
      // if (!this.user['interests']) this.user['interests'] = [];
      if (this.user['profile_image'] && this.user['profile_image'] !== '')
        this.user_image = this.image.getImageUrl(this.user['profile_image']);
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');

    // this.user = this.dataService.getUser();
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    console.log(res);
    if (res && res.data) {
      this.cities = res.data;
      if (
        this.cities.some(
          (x) => x.id === parseInt(this.user.profile_detail.city)
        )
      )
        this.city = parseInt(this.user.profile_detail.city);
      else this.city = 0;
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async editProfile() {
    let data = new FormData();
    let user = this.user;
    console.log(user);

    data.append('name', user['name']);
    data.append('email', user['email']);
    data.append('phone', user['phone']);
    data.append('gender', user['gender']);
    data.append('brief_yourself', this.user.profile_detail.brief_yourself);
    data.append('dob', user['dob']);
    data.append('state', this.state);
    data.append('city', this.city);
    for (var i = 0; i < user.interests?.length; i++) {
      data.append(`interests[${i}]`, user.interests[i]);
    }
    // data.append('address', user['address']);
    if (this._img) {
      let imageData = this._img;
      // const base64 = await fetch(imageData);
      // const blob = await base64.blob()
      // let blob = await this.image.b64toBlob(
      //   this._img,
      //   'image/' + this._img['format']
      // );
      console.log(imageData);
      data.append('profile_image', imageData);
    }

    let res = await this.network.editUser(data);
    console.log(res);
    if (res && res.data && res.data.user) {
      console.log('Update User', res.data.user);

      // if (this._img) this.user['profile_image'] = this.user_image;
      this.users.setUser(this.user);

      this.utility.presentSuccessToast(res.message);
      this.events.publish('USER_DATA_RECEIVED');
      this.nav.pop();
    } else {
      let error = res?.error?.data;
      this.utility.presentFailureToast(error ?? 'Something went wrong');
    }
  }

  // async doGetPicture(){
  //   let img = 'data:image/jpeg;base64,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';
  //   let res = await this.network.updateProfilePicture(img);
  //   console.log('update profile pic', res);
  //   if(res && Object.keys(res.data).length > 0){
  //     let user = JSON.parse(localStorage.getItem('user'));
  //     user['profile_image'] = res.data.profile_image
  //     localStorage.setItem('user', JSON.stringify(user));
  //     this.utility.presentSuccessToast(res.message);
  //     console.log('update profile pic', res);
  //   }
  // }

  async doGetPicture() {
    // return new Promise(async resolve => {
    this._img = await this.image.openCamera();
    if (this._img) {
      this.user_image = this._img;
      this.user.profile_image = this._img;
    }
    // alert(this._img);
    let res = await this.network.updateProfilePicture(this._img);
    console.log('update profile pic', res);
    if (res && Object.keys(res.data).length > 0) {
      let user = JSON.parse(localStorage.getItem('user'));
      user['profile_image'] = res.data.profile_image
      localStorage.setItem('user', JSON.stringify(user));
      this.utility.presentSuccessToast(res.message);
      console.log('update profile pic', res);
    }


    // let blob = await this.image.b64toBlob(
    //   this._img['base64String'],
    //   'image/' + this._img['format']
    // );
    // console.log(blob);
    // this.user["profile_image"] = blob;
    //   const res = await this.imageReceived(blob);
    //   resolve(res);
  }

  saveChanges() {
    if (this.isProfile) this.editProfile();
    else this.updatePassword();
  }

  async updatePassword() {
    let passwords = this.passwords;
    if (
      this.isNullOrEmpty(passwords.current_password) ||
      this.isNullOrEmpty(passwords.password) ||
      this.isNullOrEmpty(passwords.password_confirmation)
    ) {
      this.utility.presentFailureToast('Please fill all the fields');
      return;
    }
    let res = await this.network.updatePassword(this.passwords);
    console.log('res', res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.nav.pop();
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.view_type =
      ev.detail.value === 'profile'
        ? 1
        : ev.detail.value === 'membership'
          ? 2
          : 3;
    // this.isProfile = ;
  }

  isNullOrEmpty(val) {
    return this.utility.isNullOrEmpty(val);
  }

  async getInterest() {
    let res = await this.network.getInterest(this.search);
    if (res && res.data) this.list = res.data;
  }

  interestSelected(item) {
    this.list = [];
    this.user.interests.push(item);
    this.search = '';
  }

  removeInterest(item) {
    this.user.interests = this.user.interests.filter((x) => x !== item);
  }

  interestSearched(ev: any) {
    console.log('Segment changed', ev.detail.value);
    if (!this.utility.isNullOrEmpty(ev.detail.value)) this.getInterest();
  }

  addInput() {
    console.log('hello');
    this.list = [];
    this.user.interests.push(this.search);
    this.search = '';
  }

  stateChanged($event) {
    let value = $event.target.value;
    console.log(value);
    if (value) this.getCities(value);
  }

  cityChanged($event) { }

  editTag(tag) {
    this.search = tag;
    this.user.interests = this.user.interests.filter((x) => x !== tag);
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log('getInterests', res);

    this.interests = res?.data ?? [];
  }

  onPackageSelected(value) {
    console.log(value);
    this.new_package = value;
  }

  async updatePackage() {
    if (this.new_package == PLAN_TYPE.FREE) {
      if (this.new_package != this.selected_package) this.updateToFree();
    } else if (this.new_package != this.selected_package) {
      if (this.platform.is('ios')) {
        this.nav.push('pages/apple-wallet', {
          package_id: this.new_package,
          shouldRedirect: false,
        });
        return;
      } else {
        this.nav.push('pages/stripe-payment', {
          package_id: this.new_package,
          shouldRedirect: false,
        });
      }
    }
  }

  async updateToFree() {
    this.utility.showLoader();
    let user = await this.users.getUser();
    console.log('User', user);

    let data = {
      email: user.email,
      name: user.name,
      package_id: 1,
      phone: user.phone,
      // profile_image: user.profile_image,
      // profile_image_url: user.profile_image_url,
    };
    console.log('DATA', data);

    let res = await this.network.updatePackage(user.id, data);
    console.log('updateToFree', res);
    this.updateLocalUser();
  }

  async updateLocalUser() {
    let _res = await this.network.getUser();
    console.log('User', _res);
    if (_res && _res.data && _res.data.user) {
      this.users.setUser(_res.data.user);
      console.log('Updating User');
      this.utility.presentSuccessToast('Package updated successfully!');
      this.utility.hideLoader();
    }
  }

  async privacyPolicy() {
    // await Browser.open({ url: `https://hunterssocial.com/privacy` });
    await this.modals.present(PrivacyPage);

  }

  async TermofUse() {
    // await Browser.open({ url: `https://hunterssocial.com/terms` });
    await this.modals.present(TermsConditionsPage);

  }

  /* Aditional Code Here */
  initialize() {
    this.platform.ready().then(() => {
      // Only for debugging!
      this.store.verbosity = this.store.DEBUG;
      if (Capacitor.getPlatform() == 'ios') {
        this.registerProducts();
      }
      this.store.ready(() => {
        let gold = this.store.get(PRODUCT_GOLD_KEY);
        let platinum = this.store.get(PRODUCT_PLATINUM_KEY);

        if (gold) {
          const x1 = this.products.findIndex((x) => x.id == gold.id);
          if (x1 == -1) {
            this.products.push(gold);
          }
        }
        if (platinum) {
          const x2 = this.products.findIndex((x) => x.id == platinum.id);
          if (x2 == -1) {
            this.products.push(platinum);
          }
        }
        this.ref.detectChanges();
      });
    });
  }

  registerProducts() {
    this.store.register({
      id: PRODUCT_GOLD_KEY,
      type: this.store.PAID_SUBSCRIPTION,
    });
    this.store.register({
      id: PRODUCT_PLATINUM_KEY,
      type: this.store.PAID_SUBSCRIPTION,
    });
    // this.store.refresh();
    this.store.when('refreshed').approved((product: IAPProduct) => {
      // Handle the restored product 
      console.log('refreshed Restored product:', product);
      this.utility.presentSuccessToast('Purchases Products Restored');
    });

    this.store.when('updatedTransactions').approved((transaction) => {
      if (transaction.state === 'restored') {
        // The product has been restored
        console.log('updatedTransactions Restored product:', transaction.productId);
        this.utility.presentSuccessToast('Updated Transactions');
      }
    });
  }

  async restorePurchases() {
    // Trigger the restore process
    await this.store.refresh();
    this.utility.presentSuccessToast('Products Restored');
  }

  isIos(): boolean {
    return this.platform.is('ios');
  }



  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
