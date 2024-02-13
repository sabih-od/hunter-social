import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-dating-filter',
  templateUrl: './dating-filter.component.html',
  styleUrls: ['./dating-filter.component.scss'],
})
export class DatingFilterComponent extends BasePage implements OnInit {
  states = [];
  cities = [];
  interests = [];

  communicationstylelist;
  receivelove;
  educationlevel;
  zodiacsign;
  ethnicitylist;


  filteredages
  filteredgenders
  filteredinterests
  filteredstate
  filteredcity
  filteredethnicities
  filteredzodiac
  filteredlove
  filteredcommunication
  filterededucation

  tag_option_ids = [];

  obj = {
    search: '',
    ages: [],
    genders: [],
    interests: [],
    state: null,
    city: null,
    cityname: null,
    zodiac: null,
    statename: null,
    ethnicities: [],
    love: [],
    communication: [],
    education: [],
    tag_option_ids: null,
  };
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getStates();
    this.getInterests();
    this.getTagQuestions();
    console.log('this.filteredages => ', this.filteredages)
    console.log('this.filteredgenders => ', this.filteredgenders)
    console.log('this.filteredinterests => ', this.filteredinterests)
    console.log('this.filteredstate => ', this.filteredstate)
    console.log('this.filteredcity => ', this.filteredcity)
    console.log('this.filteredethnicities => ', this.filteredethnicities)
    if (this.filteredages) { this.obj.ages = this.filteredages }
    if (this.filteredgenders) { this.obj.genders = this.filteredgenders }
    if (this.filteredethnicities) { this.obj.ethnicities = this.filteredethnicities }
    if (this.filteredzodiac) { this.obj.zodiac = this.filteredzodiac.map(x => x.id); }
    if (this.filterededucation) { this.obj.education = this.filterededucation.map(x => x.id); }
    if (this.filteredlove) { this.obj.love = this.filteredlove.map(x => x.id); }
    if (this.filteredcommunication) { this.obj.communication = this.filteredcommunication.map(x => x.id); }
  }

  async getTagQuestions() {
    // const response = await this.network.getQuestions();
    this.users.ethnicities.subscribe(data => {
      this.ethnicitylist = data
    });
    this.users.tagQuestions.subscribe(data => {
      this.getTagQuestions = data
      this.communicationstylelist = this.getTagQuestions[0];
      this.receivelove = this.getTagQuestions[1];
      this.educationlevel = this.getTagQuestions[2];
      this.zodiacsign = this.getTagQuestions[3];
      console.log('tagQuestions this.zodiacsign => ', this.zodiacsign)
    });
    // console.log('getTagQuestions response.data => ', response.data);
    // this.tagquestionslist = response.data;
  }

  async getStates() {
    this.users.states.subscribe(states => {
      console.log('states -> ', states)
      this.states = states
      if (this.filteredstate) { this.obj.state = this.filteredstate; }
    })
    // let res = await this.network.getStates();
    // console.log(res);
    // if (res && res.data) {
    //   this.states = res.data;
    //   if (this.filteredstate) { this.obj.state = this.filteredstate; }
    // }
    // else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getInterests() {
    this.interests = await this.users.interestsList
    console.log('this.interesasd => ', this.interests)
    if (this.filteredinterests) { this.obj.interests = this.filteredinterests }
    // let res = await this.network.getInterests();
    // console.log('this.interesasd => ', res);
    // if (res && res.data) {
    //   this.interests = res.data;
    //   if (this.filteredinterests) { this.obj.interests = this.filteredinterests }
    // }
    // else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    console.log(res);
    if (res && res.data) {
      this.cities = res.data
      if (this.filteredcity) { this.obj.city = this.filteredcity }
    }
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  stateChanged($event) {
    let value = $event.target.value;
    console.log(value);
    if (value) this.getCities(value);
  }

  searchResult() {
    console.log(this.obj);

    var temp = Object.assign({}, this.obj);
    temp.ages = this.obj.ages.join('|') as any;
    temp.genders = this.obj.genders.join('|') as any;
    temp.interests = this.obj.interests.join('|') as any;
    temp.ethnicities = this.obj.ethnicities.join('|') as any;
    temp.statename = this.states.find(x => x.id == this.obj.state) as any;
    temp.cityname = this.cities.find(x => x.id == this.obj.city) as any;
    // console.log('this.zodiac => ', this.zodiac);
    console.log('this.communicationstylelist.tag_options => ', this.communicationstylelist.tag_options);
    console.log('this.obj.communication => ', this.obj.communication);
    temp.zodiac = this.zodiacsign.tag_options.filter(item => this.obj.zodiac?.includes(item.id));
    temp.education = this.educationlevel.tag_options.filter(item => this.obj.education?.includes(item.id));
    temp.love = this.receivelove.tag_options.filter(item => this.obj.love?.includes(item.id));
    temp.communication = this.communicationstylelist.tag_options.filter(item => this.obj.communication?.includes(item.id));

    Object.keys(temp).forEach(
      (k) => (temp[k] == null || temp[k] == '') && delete temp[k]
    );

    this.modals.dismiss({
      data: temp,
    });
  }

  close() {
    this.modals.dismiss({ data: 'A' });
  }
}
