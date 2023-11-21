import { Component, Injector, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../base-page/base-page';
import { DatingFilterComponent } from './dating-filter/dating-filter.component';
import { UserDetailComponentComponent } from './user-detail-component/user-detail-component.component';

@Component({
  selector: 'app-dating',
  templateUrl: './dating.page.html',
  styleUrls: ['./dating.page.scss'],
})
export class DatingPage
  extends BasePage
  implements OnInit, ViewWillEnter, ViewWillLeave {
  datings;
  all_datings = [];
  loading = false;
  refresh = false;
  search = '';
  dating_users = 1;
  showmodal = true;
  page = 1;

  constructor(injector: Injector, private iab: InAppBrowser) {
    super(injector);
  }

  ionViewWillLeave() {
    this.dataService.searchValueChanged.unsubscribe();
    console.log('Unsubscribed');
  }

  ionViewWillEnter() {
    this.dataService.searchValueChanged.subscribe((e) => {
      this.datings = this.all_datings.filter((dating) =>
        dating.name?.toLowerCase().includes(e.toLowerCase())
      );
      console.log('dataService.searchValueChanged res => ', this.datings);
      console.log('DatingPage Search', e);
    });
  }

  async ngOnInit() {
    this.loading = true;
    // this.datings = this.dataService.getDatings();
    this.events.subscribe('DATING_UPDATED', this.getData.bind(this));
    this.checkUser();
    // let data = await this.modals.present(UserDetailComponentComponent);
  }

  async checkUser() {
    // let res = await this.network.getUser();
    // console.log('checkUser', res);

    // if (
    //   res &&
    //   res.data &&
    //   res.data.user?.profile_detail &&
    //   !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
    //   res.data.user?.profile_detail.is_dating_profile
    // ) {
    this.getData();
    //  } else this.editUser();
  }

  async doRefresh($event) {
    this.refresh = true;
    this.page = 1;
    await this.getData();
    $event.target.complete();
  }

  async getData(data = null) {
    console.log('getData data => ', data)
    if (data) {
      // this.datings.find(x => x.id == data.addressee_id)
      const index = this.datings.findIndex(x => x.id == data.addressee_id)
      if (data.type == 'addfriend') {
        this.datings[index].is_sent_friend_request = true
        this.datings[index].canRequest = false
        this.all_datings = [...this.datings];
      } else if (data.type == 'cancelRequest' || data.type == 'unfriend') {
        this.datings[index].is_sent_friend_request = false
        this.datings[index].canRequest = true
        this.datings[index].is_friend = false
        this.all_datings = [...this.datings];
      } else if (data.type == 'acceptRequest') {
        this.datings[index].is_sent_friend_request = false
        this.datings[index].canRequest = false
        this.datings[index].is_friend_requested = false
        this.datings[index].is_friend = true
      } else if (data.type == 'block') {
        this.datings = this.datings.filter(x => x.id != data.addressee_id)
      }
      console.log('getData', this.datings);
      return;
    }

    let res = await this.network.getDatings(this.dating_users, this.search, this.page);
    console.log('network.getDatings res => ', res);
    if (res && res.data) {
      const newDatingData = res?.data?.data?.map((obj) => ({
        ...obj,
        profile_image: obj.profile_image
          ? this.image.getImageUrl(obj.profile_image)
          : this.image.getDefaultImg(),
        age: this.getAge(obj.profile_detail.dob),
        canRequest:
          !obj.is_sent_friend_request &&
          !obj.is_friend &&
          !obj.is_blocked_by_friend &&
          !obj.is_friend_blocked,
      }));
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }

    this.all_datings = [...this.datings];

    console.log('Here Datings getData dating.page.ts => ', this.datings);
    this.loading = false;
    this.refresh = false;
  }

  async searchData(d) {
    this.datings = [];
    console.log('Searching', d);

    let res = await this.network.searchDatingUsers(d);
    if (res && res.data) {
      this.datings = res.data.map((obj) => ({
        ...obj,
        profile_image: obj.profile_image
          ? this.image.getImageUrl(obj.profile_image)
          : this.image.getDefaultImg(),
        age: this.getAge(obj.profile_detail.dob),
        canRequest:
          !obj.is_sent_friend_request &&
          !obj.is_friend &&
          !obj.is_blocked_by_friend &&
          !obj.is_friend_blocked,
      }));
    }

    this.all_datings = [...this.datings];

    console.log('Here Datings searchData ', this.datings);
    this.loading = false;
  }

  getAge(dob: any) {
    let date = new Date(dob);
    let now = new Date();
    const years = Math.abs(now.getFullYear() - date.getFullYear());
    return years;
  }

  openWebView() {
    const browser = this.iab.create(Config.URL + 'public/dating', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }


  hideModal() {
    this.showmodal = false;
  }

  async editUser() {
    let data = await this.modals.present(UserDetailComponentComponent);
    console.log(data);
    if (data.data?.success) this.getData();
  }

  onIonInfinite(ev) {
    this.page = this.page + 1;
    this.getData();
    setTimeout(() => {
      ev.target.complete();
      // (ev as IonInfiniteScrollContent).target.complete();
    }, 500);
  }

  ages;
  genders;
  interests;
  state;
  city;
  cityname;
  statename;
  filters = {}

  async filter() {
    let data = await this.modals.present(
      DatingFilterComponent,
      {
        filteredages: this.ages,
        filteredgenders: this.genders,
        filteredinterests: this.interests,
        filteredstate: this.state,
        filteredcity: this.city
      },
      // {},
      // this.filters,
      'halfmodal'
    );
    console.log('Filter_Data', data);

    const d = data.data;
    this.filters = d.data;

    // if (d.data.ages) { this.ages = d.data.ages ? d.data.ages.split('|') : '' }
    // if (d.data.genders) { this.genders = d.data.genders.split('|') }
    // if (d.data.interests) { this.interests = d.data.interests.split('|') }
    // if (d.data.state) { this.state = d.data.state }
    // if (d.data.city) { this.city = d.data.city }
    // if (d.data.cityname) { this.cityname = d.data.cityname.name }
    // if (d.data.statename) { this.statename = d.data.statename.name }

    this.ages = d.data?.ages ? d.data?.ages.split('|') : '';
    this.genders = d.data?.genders ? d.data?.genders.split('|') : '';
    this.interests = d.data?.interests ? d.data?.interests.split('|') : ''
    this.state = d.data?.state ? d.data?.state : ''
    this.city = d.data?.city ? d.data?.city : ''
    this.cityname = d.data?.cityname?.name ? d.data?.cityname?.name : ''
    this.statename = d.data?.statename?.name ? d.data.statename?.name : ''



    console.log('d', d);
    if (d.data != 'A') {
      this.loading = true;
      this.searchData(d.data);
    }
  }
}
