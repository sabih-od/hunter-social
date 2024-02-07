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

    tag_option_ids: [],
    love: [],
    communication: [],
    education: '',
    zodiac: '',
    ethnicity: '',

  };
  cities = [];
  states = [];
  search;
  list = [];
  interests = [];
  constructor(injector: Injector) {
    super(injector);
  }

  // communicationstylelist = ["Big time texter", "Phone Caller", "Video chatter", "Bad texter", "Better in person"];
  // receivelove = ["Thoughtful gestures", "Presents", "Touch", "Compliments", "Time together"];
  // educationlevel = ["Bechelors", "In College", "High School", "PhD", "In Grad School", "Masters", "Trade School"];
  // zodiacsign = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  ethnicitylist = ['Alaska Native', 'Asian', 'African American', 'Hispanic', 'Native Hawaiian', 'White'];
  communicationstylelist = [];
  receivelove = [];
  educationlevel = [];
  zodiacsign = [];
  tagquestionslist = [];
  // tag_option_ids: {};

  ngOnInit() {
    this.getStates();
    this.getInterests();
    this.getTagQuestions();
  }

  getOptionsSelected(id) {
    console.log('getOptionsSelected => ', id);
  }

  async getTagQuestions() {
    const response = await this.network.getQuestions();
    // console.log('getTagQuestions response.data => ', response.data);
    this.tagquestionslist = response.data;
    this.communicationstylelist = response.data[0];
    this.receivelove = response.data[1];
    this.educationlevel = response.data[2];
    this.zodiacsign = response.data[3];
  }

  async getStates() {
    this.states = this.users.states.value;
    console.log('this.users.states.value => ', this.states);
    // let res = await this.network.getStates();
    // console.log('States', res);
    // this.states = res && res.data ? res.data : [];
  }

  async register() {
    if (!this.isValid()) {
      this.utility.presentFailureToast('Please fill out all required data');
      return;
    }
    let date = new Date(this.data.dob);
    console.log(date.toDateString);
    const communication = Object.keys(this.data.communication).filter(key => this.data.communication[key] === true);
    const love = Object.keys(this.data.love).filter(key => this.data.love[key] === true);
    this.data.tag_option_ids = [...communication, ...love];
    this.data.education != '' && this.data.tag_option_ids.push(this.data.education);
    this.data.zodiac != '' && this.data.tag_option_ids.push(this.data.zodiac);
    this.data.tag_option_ids = this.data.tag_option_ids.map(Number);
    const newdata = { ...this.data }
    delete newdata.communication;
    delete newdata.love;
    delete newdata.zodiac;
    delete newdata.education;

    console.log('newdata => ', newdata);

    // return;
    let res = await this.network.switchToDatingProfile({
      ...newdata,
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
    const communication = Object.keys(this.data.communication).filter(key => this.data.communication[key] === true);
    console.log('communication => ', communication)
    const love = Object.keys(this.data.love).filter(key => this.data.love[key] === true);
    console.log('love => ', love)
    return (
      !this.isNullOrEmpty(data.brief_yourself)
      && !this.isNullOrEmpty(data.dob)
      && !this.isNullOrEmpty(data.phone)
      && !this.isNullOrEmpty(data.state)
      && !this.isNullOrEmpty(data.interests)
      && !this.isNullOrEmpty(data.zodiac)
      && !this.isNullOrEmpty(data.education)
      && !this.isNullOrEmpty(data.ethnicity)
      && communication.length != 0
      && love.length != 0
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
    this.interests = this.users.interestsList;
    console.log('get interests res => ', this.interests);
    // let res = await this.network.getInterests();
    // console.log('getInterests', res);

    // this.interests = res?.data ?? [];
  }
}
