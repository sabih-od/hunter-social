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

  obj = {
    search: '',
    ages: [],
    genders: [],
    interests: [],
    state: null,
    city: null,
  };
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getStates();
    this.getInterests();
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log(res);
    if (res && res.data) this.states = res.data;
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log(res);
    if (res && res.data) this.interests = res.data;
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    console.log(res);
    if (res && res.data) this.cities = res.data;
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
