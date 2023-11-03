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

  filteredages
  filteredgenders
  filteredinterests
  filteredstate
  filteredcity

  obj = {
    search: '',
    ages: [],
    genders: [],
    interests: [],
    state: null,
    city: null,
    cityname: null,
    statename: null,
  };
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getStates();
    this.getInterests();
    console.log('this.filteredages => ', this.filteredages)
    console.log('this.filteredgenders => ', this.filteredgenders)
    console.log('this.filteredinterests => ', this.filteredinterests)
    console.log('this.filteredstate => ', this.filteredstate)
    console.log('this.filteredcity => ', this.filteredcity)
    if (this.filteredages) { this.obj.ages = this.filteredages }
    if (this.filteredgenders) { this.obj.genders = this.filteredgenders }
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log(res);
    if (res && res.data) {
      this.states = res.data;
      if (this.filteredstate) { this.obj.state = this.filteredstate; }
    }
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log(res);
    if (res && res.data) {
      this.interests = res.data;
      if (this.filteredinterests) { this.obj.interests = this.filteredinterests }
    }
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
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
