import { Component, Injector, OnInit } from '@angular/core';
import { Platform, ViewWillEnter } from '@ionic/angular';
import { PLAN_TYPE } from 'src/app/data/const/enums';
import { StripeService } from 'src/app/services/stripe.service';
import { BasePage } from '../base-page/base-page';
import { StripePaymentPage } from '../stripe-payment/stripe-payment.page';
import { Browser } from '@capacitor/browser';
import { PrivacyPage } from '../privacy/privacy.page';
import { TermsConditionsPage } from '../terms-conditions/terms-conditions.page';

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
  interests = [];
  package = [];
  view_type = 1;
  selected_package = 1;
  new_package = 1;

  constructor(
    injector: Injector,
    public stripe: StripeService,
    public platform: Platform
  ) {
    super(injector);
  }
  ionViewWillEnter(): void {
    if (this.user) this.getUser();
  }

  async ngOnInit() {
    this.stripe.init();
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

  async getUser() {
    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
      console.log(this.user);
      this.selected_package = this.user.profile_detail.package_id;
      this.new_package = this.user.profile_detail.package_id;
      this.state = parseInt(this.user.profile_detail.state);
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
    // data.append('dob', user['dob']);
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

  async doGetPicture() {
    // return new Promise(async resolve => {
    this._img = await this.image.openCamera();
    if (this._img) {
      this.user_image = this._img;
      this.user.profile_image = this._img;
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

  cityChanged($event) {}

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
}
