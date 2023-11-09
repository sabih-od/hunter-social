import { Component, Injector, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Config } from 'src/app/config/main.config';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { DatingFilterComponent } from 'src/app/pages/dating/dating-filter/dating-filter.component';
import { UserDetailComponentComponent } from 'src/app/pages/dating/user-detail-component/user-detail-component.component';

@Component({
  selector: 'dating',
  templateUrl: './dating.component.html',
  styleUrls: ['./dating.component.scss'],
})
export class DatingComponent extends BasePage implements OnInit, ViewWillLeave {
  datings;
  all_datings = [];
  isLoading = false;
  search = '';
  dating_users = 0;
  role_id;
  dating_enabled = false;
  _search = '';
  page = 1;

  constructor(injector: Injector, private iab: InAppBrowser) {
    super(injector);
  }

  ionViewWillLeave() {
    this.dataService.searchValueChanged.unsubscribe();
    console.log('Unsubscribed');
  }

  onSearch(clear) {
    if (clear) this._search = '';
    else this._search = this._search;
    console.log('this._search', this._search)
    if (this.timeToken) clearTimeout(this.timeToken);
    this.timeToken = setTimeout(() => {
      this.isLoading = true;
      this.page = 1;
      this.datings = []
      this.getData();
    }, 1000);
  }

  datingEnable() {
    return new Promise<boolean>(async (resolve) => {
      let res = await this.network.getUser();
      console.log('checkUser', res);

      if (
        res &&
        res.data &&
        res.data.user?.profile_detail &&
        !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
        res.data.user?.profile_detail.is_dating_profile
      ) {
        resolve(true);
        // this.openDatingChatRoom();
      } else resolve(false);
      //else this.editUser();
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    this.dating_enabled = await this.datingEnable();
    // this.datings = this.dataService.getDatings();
    this.events.subscribe('DATING_UPDATED', this.getData.bind(this));
    this.checkUser();
    // this.isLoading = false;
    const res = await this.users.getUser();
    this.role_id = res.role_id;
    console.log('USRE', this.role_id);

    this.dataService.searchValueChanged.subscribe((e) => {
      this.datings = this.all_datings.filter((dating) =>
        dating.name?.toLowerCase().includes(e.toLowerCase())
      );
      console.log('DatingPage Search', e);
    });
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
    this.page = 1;
    await this.getData();
    $event.target.complete();
    // this.isLoading = false;
  }

  async getData(data = null) {
    console.log('dating component getData data => ', data)
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

    console.log('this._search => ', this._search)

    let res = await this.network.getDatings(this.dating_users, this._search, this.page);
    console.log('getDating => ', res?.data?.data);
    if (res && res?.data?.data) {
      // var newdata = res.data.splice(0,10)
      const newDatingData = res?.data?.data.map((obj) => ({
        ...obj,
        profile_image: obj.profile_image
          ? this.image.getImageUrl(obj.profile_image)
          : this.image.getDefaultImg(),
        age: this.getAge(obj.profile_detail.dob),
        canRequest:
          !obj.is_sent_friend_request &&
          !obj.is_friend &&
          !obj.is_blocked_by_friend &&
          !obj.is_friend_requested &&
          !obj.is_friend_blocked,
      }));
      console.log('newDatingData => ', newDatingData)
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }
    this.all_datings = this.datings; //[...this.datings];

    this.isLoading = false;
    console.log('Here Datings getData com', this.datings);
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

  filter() {
    this.modals.present(DatingFilterComponent, {}, 'halfmodal');
  }

  onIonInfinite(ev) {
    this.page = this.page + 1;
    this.getData();
    setTimeout(() => {
      ev.target.complete();
      // (ev as IonInfiniteScrollContent).target.complete();
    }, 500);
  }

  timeToken;

  updateSearchResults() {
    console.log('this._search', this._search)
    if (this.timeToken) clearTimeout(this.timeToken);
    this.timeToken = setTimeout(() => {
      this.isLoading = true;
      this.page = 1;
      this.datings = []
      this.getData();
    }, 1000);
  }

}
