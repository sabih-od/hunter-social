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
    this.next_page_url = response?.data?.next_page_url;
    const notiitems = response?.data?.data.map((notifi) => ({
      ...notifi,
      // hasUnread: self.sender_id === notifi.id,
      // content: notifi?.notificationable && (notifi?.notificationable?.user?.is_friend_requested && notifi?.notificationable?.user.name + ' sent you friend request' || notifi?.notificationable?.user?.is_friend && notifi?.notificationable?.user.name + ' accepted friend request'),
      profile_image: this.image.getImageUrl(notifi?.user?.profile_image),
    }));
    this.notifications = this.page != 1 ? [...this.notifications, ...notiitems] : notiitems;


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

    // this.notifications = response?.data?.data
    this.loading = false;
  }


  async acceptRequest(params) {
    const { userid, id } = params;
    let res = await this.network.acceptRequest(userid);
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
    if (res && res.data) {
      this.notifications = this.notifications.filter(x => x.id != id)
      // this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async clickNotification(item) {
    if (item?.cm_u_id) {
      this.nav.push('pages/conversations', {
        type: 'individual',
      })
    }
    else if (item?.admin_user_id) {
      this.nav.push('pages/chat', {
        is_admin: 1,
      })
    } else {
      let res = await this.network.readNotifiaction({
        "ids": item?.id
      })
      // this.users.getNotificationCount()
      // const count = JSON.parse(localStorage.getItem('notifications_count'));
      this.badge.decrease(1);
      this.users.getNotificationCount();
    }

    // const badgeres =  await Badge.decrease();
    // localStorage.setItem('notifications_count', (count - 1).toString());
    // var event = new Event('storageChange');
    // window.dispatchEvent(event);

  }

  // async clickNotification(id) {
  //   let res = await this.network.readNotifiaction({
  //     "ids": id
  //   })
  //   // const count = JSON.parse(localStorage.getItem('notifications_count'));

  //   this.getNotificationCount();

  //   this.badge.decrease(1);
  //   // const badgeres =  await Badge.decrease();
  //   // localStorage.setItem('notifications_count', (count - 1).toString());
  //   var event = new Event('storageChange');
  //   window.dispatchEvent(event);

  // }

  async getNotificationCount() {
    const noticount = await this.network.getUnreadNotificationCount();
    this.dataService.updateNotificationsCount(noticount?.data?.count);
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

