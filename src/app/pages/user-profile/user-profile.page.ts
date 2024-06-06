import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage extends BasePage implements OnInit {
  user: any;
  profileItems: any;
  user_image: any;
  user_id: any;

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    // this.user = await this.users.getUser();
    this.profileItems = this.dataService.getProfileItems();
    this.events.subscribe('USER_DATA_RECEIVED', async (data: any) => {
      this.user = await this.users.getUser();
    });
  }

  ionViewWillEnter() {
    this.getUser();
  }

  async getUser() {
    this.user_id = this.nav.getQueryParams().user_id;
    let res = await this.network.getUser();
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
      if (this.user['profile_image'] && this.user['profile_image'] !== '')
        this.user_image = this.image.getImageUrl(this.user['profile_image']);
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }


  itemClicked(item: { url: any }) {
    if (item.url) this.nav.push(item.url);
  }
}
