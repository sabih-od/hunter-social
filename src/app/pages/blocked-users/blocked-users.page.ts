import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.page.html',
  styleUrls: ['./blocked-users.page.scss'],
})
export class BlockedUsersPage extends BasePage implements OnInit {
  datings = [];
  all_datings = [];
  dating_users = 1;
  search = '';
  _search = '';
  isLoading = false;
  page = 1;
  constructor(
    injector: Injector,
    public platform: Platform,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.isLoading = true;
    let res = await this.network.getBloackedUsers({ query: this._search }, this.page);
    if (res && res?.data?.data) {
      console.log('geBloackedUsers res.data => ', res);
      const newDatingData = res.data.data.map((obj) => (
        {
          ...obj,
          profile_image: obj?.blocked_user_detail?.profile_image
            ? this.image.getImageUrl(obj?.blocked_user_detail?.profile_image)
            : this.image.getDefaultImg(),
          // age: this.getAge(obj.profile_detail.dob),
          // canRequest:
          //   !obj.is_sent_friend_request &&
          //   !obj.is_friend &&
          //   !obj.is_blocked_by_friend &&
          //   !obj.is_friend_blocked,
        }));
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }

    this.all_datings = [...this.datings];
    this.isLoading = false;

    console.log('Here Datings getData blocked', this.datings);
  }

  getAge(dob: any) {
    let date = new Date(dob);
    let now = new Date();
    const years = Math.abs(now.getFullYear() - date.getFullYear());
    return years;
  }

  timeToken
  onSearch(clear) {
    if (clear) this.search = '';
    else this.search = this._search;
    console.log('this._search', this._search)
    if (this.timeToken) clearTimeout(this.timeToken);
    this.timeToken = setTimeout(() => {
      this.datings = []
      this.getData();
    }, 1000);
  }

  async unblockUser(userid) {
    let formData = new FormData();
    formData.append('_method', 'delete');
    // alert(JSON.stringify(formData))
    // alert(JSON.stringify(this.user_id))
    var res = await this.network.unblockUser(userid, formData);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.datings = this.datings.filter(x => x.user_id != userid)
      // this.getData();
      // this.nav.navigateTo('pages/chat-room');
    }
  }

  async doRefresh($event) {
    this.isLoading = true;
    this.page = 1;
    await this.getData();
    $event.target.complete();
    this.isLoading = false;
  }

  onIonInfinite(ev) {
    this.page = this.page + 1;
    this.getData();
    setTimeout(() => {
      ev.target.complete();
      // (ev as IonInfiniteScrollContent).target.complete();
    }, 500);
  }

}
