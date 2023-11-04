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
  search: '';
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
    let res = await this.network.getBloackedUsers();
    if (res && res.data) {
      console.log('geBloackedUsers res.data => ', res);
      this.datings = res.data.map((obj) => ({
        ...obj.blocked_user_detail,
        profile_image: obj.blocked_user_detail.profile_image
          ? this.image.getImageUrl(obj.blocked_user_detail.profile_image)
          : this.image.getDefaultImg(),
        // age: this.getAge(obj.profile_detail.dob),
        // canRequest:
        //   !obj.is_sent_friend_request &&
        //   !obj.is_friend &&
        //   !obj.is_blocked_by_friend &&
        //   !obj.is_friend_blocked,
      }));
    }

    this.all_datings = [...this.datings];

    console.log('Here Datings getData blocked', this.datings);
  }

  getAge(dob: any) {
    let date = new Date(dob);
    let now = new Date();
    const years = Math.abs(now.getFullYear() - date.getFullYear());
    return years;
  }

  async unblockUser(userid){
    let formData = new FormData();
    formData.append('_method', 'delete');
    // alert(JSON.stringify(formData))
    // alert(JSON.stringify(this.user_id))
    var res = await this.network.unblockUser(userid,formData);
    if(res){
      this.utility.presentSuccessToast(res.message);
      this.getData();
      // this.nav.navigateTo('pages/chat-room');
    }
  }

}
