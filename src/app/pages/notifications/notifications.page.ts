import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage extends BasePage implements OnInit {
  notifications = [];
  loading = false;
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loading = true;
    this.getNotifications()
  }

  async getNotifications() {
    let response = await this.network.getNotifications(1, 10);
    this.loading = false;
    console.log('getNotifications response => ', response)
    this.notifications = response?.data?.data.map((user) => ({
      ...user,
      // hasUnread: self.sender_id === user.id,
      profile_image: this.image.getImageUrl(user?.notificationable?.addressee?.profile_image || user?.notificationable?.requester?.profile_image),
    }));
    console.log('this.currentFriends => ', this.notifications)
    this.notifications = response?.data?.data
  }

}
