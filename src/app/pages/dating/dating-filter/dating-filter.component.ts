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

  communicationstylelist = [];
  receivelove = [];
  educationlevel = [];
  zodiacsign = [];
  ethnicitylist = ['Alaska Native', 'Asian', 'African American', 'Hispanic', 'Native Hawaiian', 'White'];


  filteredages
  filteredgenders
  filteredinterests
  filteredstate
  filteredcity
  filteredethnicities


  tag_option_ids = [];
  love = [];
  communication = [];
  education = [];
  zodiac = [];
  ethnicities = [];

  obj = {
    search: '',
    ages: [],
    genders: [],
    interests: [],
    state: null,
    city: null,
    cityname: null,
    statename: null,
    ethnicities: [],
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
  }
  async getTagQuestions() {
    const response = await this.network.getQuestions();
    // console.log('getTagQuestions response.data => ', response.data);
    // this.tagquestionslist = response.data;
    this.communicationstylelist = response.data[0];
    this.receivelove = response.data[1];
    this.educationlevel = response.data[2];
    this.zodiacsign = response.data[3];
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
