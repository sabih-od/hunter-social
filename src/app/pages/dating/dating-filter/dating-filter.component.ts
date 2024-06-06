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
  filteredtagids

  tag_option_ids = [];
  questions = [];
  obj = {
    search: '',
    ages: [],
    genders: [],
    interests: [],
    state: null,
    city: null,
    cityname: null,
    // zodiac: null,
    statename: null,
    ethnicities: [],
    // love: [],
    // communication: [],
    // education: [],
    tag_option_ids: [],
    selectedques: [],
  };
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getStates();
    this.getInterests();
    if (this.filteredages) { this.obj.ages = this.filteredages }
    if (this.filteredgenders) { this.obj.genders = this.filteredgenders }
    if (this.filteredethnicities) { this.obj.ethnicities = this.filteredethnicities }
    if (this.filteredtagids) { this.obj.tag_option_ids = this.filteredtagids }
    this.getTagQuestions();
  }

  async getTagQuestions() {
    // const response = await this.network.getQuestions();
    this.users.ethnicities.subscribe(data => {
      this.ethnicitylist = data
    });
    this.users.tagQuestions.subscribe(data => {
      if (data) {
        if (data) {
          this.questions = data.map((ques) => {
            return {
              ...ques,
              tag_option_ids: ques.tag_options.map(opt => {
                if (this.obj.tag_option_ids.includes(opt.id)) return opt.id;
              }).filter(Boolean)
            }
          });
        }
      }
    });
    // this.tagquestionslist = response.data;
  }


  getSelectedTagOptions() {
    const newarr = this.questions.map(ques => Array.isArray(ques?.tag_option_ids) ? ques?.tag_option_ids?.map(opt => opt) : ques?.tag_option_ids);
    const mergedArray = [].concat(...newarr);
    this.obj.tag_option_ids = mergedArray;
  }

  async getStates() {
    this.users.states.subscribe(states => {
      this.states = states
      if (this.filteredstate) { this.obj.state = this.filteredstate; }
    })
    // let res = await this.network.getStates();
    // if (res && res.data) {
    //   this.states = res.data;
    //   if (this.filteredstate) { this.obj.state = this.filteredstate; }
    // }
    // else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getInterests() {
    this.interests = await this.users.interestsList
    if (this.filteredinterests) { this.obj.interests = this.filteredinterests }
    // let res = await this.network.getInterests();
    // if (res && res.data) {
    //   this.interests = res.data;
    //   if (this.filteredinterests) { this.obj.interests = this.filteredinterests }
    // }
    // else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    if (res && res.data) {
      this.cities = res.data
      if (this.filteredcity) { this.obj.city = this.filteredcity }
    }
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  stateChanged($event) {
    let value = $event.target.value;
    if (value) this.getCities(value);
  }

  searchResult() {

    var temp = Object.assign({}, this.obj);
    temp.ages = this.obj.ages.join('|') as any;
    temp.genders = this.obj.genders.join('|') as any;
    temp.interests = this.obj.interests.join('|') as any;
    temp.ethnicities = this.obj.ethnicities.join('|') as any;
    temp.statename = this.states.find(x => x.id == this.obj.state) as any;
    temp.cityname = this.cities.find(x => x.id == this.obj.city) as any;
    temp.tag_option_ids = this.obj.tag_option_ids.join('|') as any;
    temp.selectedques = this.questions.map((ques) => {
      return {
        ...ques,
        selected: ques.tag_options.map(opt => {
          if (this.obj.tag_option_ids.includes(opt.id)) return opt;
        }).filter(Boolean)
      }
    });
    // temp.zodiac = this.zodiacsign.tag_options.filter(item => this.obj.zodiac?.includes(item.id));
    // temp.education = this.educationlevel.tag_options.filter(item => this.obj.education?.includes(item.id));
    // temp.love = this.receivelove.tag_options.filter(item => this.obj.love?.includes(item.id));
    // temp.communication = this.communicationstylelist.tag_options.filter(item => this.obj.communication?.includes(item.id));

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
