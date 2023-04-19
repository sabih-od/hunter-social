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
  implements OnInit, ViewWillEnter, ViewWillLeave
{
  datings;
  all_datings = [];
  isLoading = false;
  search = '';
  dating_users = 1;

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
      console.log('DatingPage Search', e);
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    // this.datings = this.dataService.getDatings();
    this.events.subscribe('DATING_UPDATED', this.getData.bind(this));
    this.checkUser();
    this.isLoading = false;
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
    this.isLoading = true;
    await this.getData();
    $event.target.complete();
    this.isLoading = false;
  }

  async getData() {
    let res = await this.network.getDatings(this.dating_users, this.search);
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

    console.log('Here Datings', this.datings);
  }

  async searchData(d) {
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

    console.log('Here Datings', this.datings);
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

  async editUser() {
    let data = await this.modals.present(UserDetailComponentComponent);
    console.log(data);
    if (data.data?.success) this.getData();
  }

  async filter() {
    let data = await this.modals.present(
      DatingFilterComponent,
      {},
      'halfmodal'
    );
    console.log('Filter_Data', data);

    const d = data.data;

    console.log('d', d);
    if (d.data != 'A') {
      this.searchData(d.data);
    }
  }
}
