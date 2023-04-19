import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-peoples',
  templateUrl: './peoples.component.html',
  styleUrls: ['./peoples.component.scss'],
})
export class PeoplesComponent extends BasePage implements OnInit {
  users;
  search;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.events.subscribe('PEOPLE_UPDATED', () => {
      this.getUsers();
    });
    this.getUsers();
  }

  async getUsers() {
    let res = await this.network.getUsers();
    console.log('getUsers', res);

    if (res && res.data) {
      this.users = res.data.map((user) => ({
        ...user,
        profile_image: this.image.getImageUrl(user.profile_image),
        canChat: user.is_friend && !user.is_blocked_by_friend,
        canRequest:
          !user.is_sent_friend_request &&
          !user.is_friend &&
          !user.is_blocked_by_friend &&
          !user.is_friend_blocked,
      }));
      console.log('getUsers After', this.users);
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }
}
