import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { Badge } from '@ionic-native/badge/ngx';
// import { Badge } from '@capawesome/capacitor-badge';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage extends BasePage implements OnInit {
  notifications = [];
  loading = false;
  refresh = false;
  page = 1;
  limit = 12;
  next_page_url = null;
  constructor(
    injector: Injector,
    private badge: Badge
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loading = true;
    this.getNotifications()
  }

  async getNotifications() {

    // localStorage.setItem('notifications_count', '0');
    // var event = new Event('storageChange');
    // window.dispatchEvent(event);

    let response = await this.network.getNotifications(this.page, this.limit);
    console.log('getNotifications response => ', response)
    this.next_page_url = response?.data?.next_page_url;
    const notiitems = response?.data?.data.map((notifi) => ({
      ...notifi,
      // hasUnread: self.sender_id === notifi.id,
      // content: notifi?.notificationable && (notifi?.notificationable?.user?.is_friend_requested && notifi?.notificationable?.user.name + ' sent you friend request' || notifi?.notificationable?.user?.is_friend && notifi?.notificationable?.user.name + ' accepted friend request'),
      profile_image: this.image.getImageUrl(notifi?.user?.profile_image),
    }));
    this.notifications = this.page != 1 ? [...this.notifications, ...notiitems] : notiitems;
    console.log('this.notifications => ', this.notifications)


    // for (let i = 0; i < response?.data?.data.length; i++) {
    //   let obj = { ...response?.data?.data[i] }
    //   if (obj.notificationable) {
    //     obj.notificationable.user.profile_image = this.image.getImageUrl(obj.notificationable.user.profile_image)
    //     if (obj.notificationable.status == 2) {
    //       obj.content = `${obj.notificationable.user?.name} has been blocked!`
    //     } else if (obj.notificationable.user.is_friend) {
    //       obj.content = `${obj.notificationable.user?.name} friend request accepted`
    //     } else if (obj.notificationable.user.is_friend_requested) {
    //       obj.content = obj.notificationable.user?.name + ' sent you friend request'
    //     }
    //   }
    //   this.notifications.push(obj)
    // }

    console.log('this.notifications => ', this.notifications)
    // console.log('this.currentFriends => ', this.notifications)
    // console.log('this.currentFriends[1].profile_image => ', this.notifications[1].profile_image)
    // this.notifications = response?.data?.data
    this.loading = false;
  }


  async acceptRequest(params) {
    const { userid, id } = params;
    // console.log('userid, id => ', userid, id)
    let res = await this.network.acceptRequest(userid);
    console.log('acceptRequest', res);
    if (res && res.data) {
      // this.utility.presentSuccessToast(res.message);
      const index = this.notifications.findIndex(x => x.id == id)
      this.notifications[index].is_friend_request = false;
      // this.notifications[index].notificationable.user.is_friend = true;

      let user = await this.users.getUser()
      user.connection_count = user.connection_count + 1;
      this.users.setUser(user)

      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async ignoreRequest(params) {
    const { userid, id } = params;
    let res = await this.network.ignoreRequest(userid);
    console.log('ignoreRequest', res);
    if (res && res.data) {
      this.notifications = this.notifications.filter(x => x.id != id)
      // this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async clickNotification(id) {
    console.log('clickNotification id => ', id)
    let res = await this.network.readNotifiaction({
      "ids": id
    })
    console.log('clickNotification => ', res)
    const count = JSON.parse(localStorage.getItem('notifications_count'));


    this.badge.decrease(1);
    // const badgeres =  await Badge.decrease();
    localStorage.setItem('notifications_count', (count - 1).toString());
    var event = new Event('storageChange');
    window.dispatchEvent(event);

  }

  async doRefresh($event) {
    this.refresh = true;
    this.page = 1;
    // this.notifications = []
    await this.getNotifications();
    $event.target.complete();
    this.refresh = false;
  }

  async onIonInfinite(ev) {
    if (this.next_page_url) {
      this.page = this.page + 1;
      await this.getNotifications();
      setTimeout(() => {
        ev.target.complete();
      }, 700);
    }
  }

}

