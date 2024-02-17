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
    // love: [],
    // communication: [],
    // education: '',
    // zodiac: '',
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

  ethnicitylist = [];
  questions = [];

  ngOnInit() {
    this.getStates();
    this.getInterests();
    this.getTagQuestions();
  }

  getOptionsSelected(id) {
    console.log('getOptionsSelected => ', id);
  }

  async getTagQuestions() {

    this.users.ethnicities.subscribe(data => {
      this.ethnicitylist = data
    });
    this.users.tagQuestions.subscribe(data => {
      if (data) {
        if (data) {
          this.questions = data.map((ques) => {
            return {
              ...ques,
              tag_option_ids: ques.is_multi_select == 1 ? [] : ''
            }
          });
        }
        console.log('this.questions data => ', this.questions);
        console.log('this.data.tag_option_ids data => ', this.data.tag_option_ids);
      }

    });

  }

  getSelectedTagOptions($event) {
    // this.questions.map(ques => console.log('quest => ', ques));
    console.log('event => ', $event.target.value);
    const newarr = this.questions.map(ques => Array.isArray(ques?.tag_option_ids) ? Object.keys(ques?.tag_option_ids).filter(key => ques?.tag_option_ids[key] === true) : ques?.tag_option_ids != '' && ques?.tag_option_ids);
    const mergedArray = [].concat(...newarr).filter(Boolean);
    const arrayOfNumbers: number[] = mergedArray.map(item => typeof item === 'string' ? parseInt(item, 10) : item);
    this.data.tag_option_ids = arrayOfNumbers;
    console.log('this.data.tag_option_ids => ', this.data.tag_option_ids);
  }


  async getStates() {
    this.states = this.users.states.value;
    console.log('this.users.states.value => ', this.states);
    // let res = await this.network.getStates();
    // console.log('States', res);
    // this.states = res && res.data ? res.data : [];
  }
  _loading = false;
  async register() {
    if (!this.isValid()) {
      this.utility.presentFailureToast('Please fill out all required data');
      return;
    }
    let date = new Date(this.data.dob);
    console.log(date.toDateString);
    this.data.dob = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;


    console.log('this.data.dob => ', this.data);
    this._loading = true;
    // // return;
    let res = await this.network.switchToDatingProfile({
      ...this.data,
      dob: `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
    });
    console.log('register', res);
    this._loading = false;
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.modals.dismiss({ success: true });
      this.events.publish('DATING_PROFILE_CREATED');
      let userRes = await this.network.getUser();
      this.users.setUser(userRes.data.user);
      this.users.updateUserProfile(userRes.data.user)
      localStorage.setItem('user', JSON.stringify(userRes.data.user));
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }

  isValid() {
    let data = this.data;
    console.log('this.questions => ', this.questions)
    // const checktagids = this.questions.some(obj => Array.isArray(obj.tag_option_ids) ? obj.tag_option_ids.length > 0 : obj.tag_option_ids != '');
    // const checktagids = any(item.get("tag_option_ids") and len(item["tag_option_ids"]) > 0 for item in this.questions)
    const abcd = this.questions.map(item => { return Array.isArray(item.tag_option_ids) ? item.tag_option_ids.length > 0 : item.tag_option_ids != '' })
    const checktagids = abcd.every(element => element === true);
    console.log('checktagids => ', checktagids);

    return (
      !this.isNullOrEmpty(data.brief_yourself)
      && !this.isNullOrEmpty(data.dob)
      && !this.isNullOrEmpty(data.phone)
      && !this.isNullOrEmpty(data.state)
      && !this.isNullOrEmpty(data.interests)
      && checktagids
      && !this.isNullOrEmpty(data.ethnicity)
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
