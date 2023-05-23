import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-how-to',
  templateUrl: './how-to.page.html',
  styleUrls: ['./how-to.page.scss'],
})
export class HowToPage extends BasePage implements OnInit {
  list = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.events.subscribe('HOW_TO_POST_UPDATED', () => {
      this.getData();
    });
    this.getData();
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getData();
      event.target.complete();
    }, 2000);
  }

  async getData() {
    let res = await this.network.howToVideos();
    console.log('howToVideos', res);
    let user = await this.users.getUser();
    if (res && res.data) {
      this.list = res.data.data.map((item) => ({
        ...item,
        user: {
          ...item.user,
          profile_image: this.users.getProfileImage(item.user?.profile_image),
        },
        selfPost: item.user_id === user.id,
      }));
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }
}
