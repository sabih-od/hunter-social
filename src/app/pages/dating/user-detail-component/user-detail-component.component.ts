import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-user-detail-component',
  templateUrl: './user-detail-component.component.html',
  styleUrls: ['./user-detail-component.component.scss'],
})
export class UserDetailComponentComponent extends BasePage implements OnInit {
  data = {
    brief_yourself: '',
    dob: undefined,
    gender: 'male',
    marital_status: 'single',
    phone: '',
    state: '',
    interests: [],
    city: '',
  };
  cities = [];
  states = [];
  search;
  list = [];
  interests = [];
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getStates();
    this.getInterests();
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log('States', res);

    this.states = res && res.data ? res.data : [];
  }

  async register() {
    if (!this.isValid()) {
      this.utility.presentFailureToast('Please fill out all required data');
      return;
    }
    let date = new Date(this.data.dob);
    console.log(date.toDateString);
    // return;
    let res = await this.network.switchToDatingProfile({
      ...this.data,
      dob: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
    });
    console.log('register', res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.modals.dismiss({ success: true });
      this.events.publish('DATING_PROFILE_CREATED');
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }

  isValid() {
    let data = this.data;
    return (
      !this.isNullOrEmpty(data.brief_yourself) &&
      !this.isNullOrEmpty(data.dob) &&
      !this.isNullOrEmpty(data.phone) &&
      !this.isNullOrEmpty(data.state) &&
      !this.isNullOrEmpty(data.interests)
    );
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
    this.data.interests.push(item);
    this.search = '';
  }

  removeInterest(item) {
    this.data.interests = this.data.interests.filter((x) => x !== item);
  }

  interestSearched(ev: any) {
    console.log('Segment changed', ev.detail.value);
    if (!this.utility.isNullOrEmpty(ev.detail.value)) this.getInterest();
  }

  addInput() {
    this.list = [];
    this.data.interests.push(this.search);
    this.search = '';
  }

  stateChanged($event) {
    let value = $event.target.value;
    console.log(value);
    if (value) this.getCities(value);
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    console.log(res);
    if (res && res.data) this.cities = res.data;
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log('getInterests', res);

    this.interests = res?.data ?? [];
  }
}
