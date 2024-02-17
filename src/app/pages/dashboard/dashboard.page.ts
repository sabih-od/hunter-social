import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { ChatBatsComponent } from 'src/app/components/chat-bats/chat-bats.component';
import { AlertController } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends BasePage implements OnInit {
  user_id: any;
  constructor(
    injector: Injector,
    private alertController: AlertController,
    public badge: Badge,
  ) {
    super(injector);
  }

  ProcActivo: boolean = false;
  friends = [];
  notifications = [];
  recipesAlerts = [];
  postAlerts = [];
  sender_id = undefined;
  tab = 'friends';
  innertab = 'recipe';
  loading = true;
  current_user: any;
  orderslength = 0;
  page = 1;
  friendspage = 1;

  async ngOnInit() {
    this.loading = true;
    this.getNotificationsObject();
    this.getfriends();

    this.current_user = await this.users.getUser();
    this.user_id = this.current_user.id;

    // this.getNotifications()

    // this.getPostAlerts();
    // this.getRecipeAlerts();
    this.events.subscribe('UPDATE_CHANNELS', this.newMessage.bind(this));

  }

  newMessage(data) {
    console.log('newMessage data => ', data)
    this.users.getNotificationCount()
    if (data.sender_id) {
      const list = this.friends.map(x => {
        if (x.id == data.sender_id) {
          // x.hasUnread = true;
          x.notifications = x.notifications + 1
        }
        return x;
      })

      console.log('list => ', list)
      // const index = _.findIndex(list, { 'sender_id': data.sender_id });
      const index = list.findIndex(x => x.id == data.sender_id);
      console.log('index => ', index)
      if (index !== -1) {
        const movedObject = list.splice(index, 1)[0];
        list.unshift(movedObject);
      }
      console.log('list => ', list)

      this.friends = list;
    }
  }
  unreadNotificationCount = 0;
  friendNotiCount = 0;
  async getNotificationsObject() {
    this.dataService.notification_and_message_count.subscribe(data => {
      console.log('this.dataService.notification_and_message_count data => ', data)
      this.friendNotiCount = data?.friend;
      this.unreadNotificationCount = data?.unread_count;
    })
  }

  async clickNotification(item) {
    console.log('clickNotification item => ', item)
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
      console.log('clickNotification 123 => ')
      let res = await this.network.readNotifiaction({
        "ids": item?.id
      })
      console.log('clickNotification => ', res)
      // this.users.getNotificationCount()
      // const count = JSON.parse(localStorage.getItem('notifications_count'));
      this.badge.decrease(1);
      this.users.getNotificationCount();
    }

  }


  async getfriends() {
    this.sender_id = this.dataService.dataId;
    let res = await this.network.getDashboardFriends(this.friendspage, 20);
    this.loading = false;
    console.log('friends response => ', res?.data?.data)
    let self = this;
    if (res && res?.data?.data) {
      const friendslist = res?.data?.data.map((item) => ({
        ...item,
        // hasUnread: self.sender_id === item.id,
        profile_image: this.image.getImageUrl(item?.profile_image),
      }));
      this.friends = this.friendspage != 1 ? [...this.friends, ...friendslist] : friendslist;
      console.log('this.friends => ', this.friends)

      // this.friends = [
      //   {
      //     name: 'Atif Garam',
      //     is_friend: true,

      //   }
      // ]
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    // this.dataService.dataId = null;
    // console.log('Sender Id destroyed', this.sender_id);

    // this.friends = response?.data?.data.map((item) => ({
    //   ...item,
    //   // hasUnread: self.sender_id === item.id,
    //   profile_image: this.image.getImageUrl(item.profile_image),
    // }));
    console.log('this.friends => ', this.friends)
    // this.friends = response?.data?.data

    const resp = await this.network.getUserOrders();
    console.log('orders resp => ', resp)
    if (resp && resp?.data) {
      this.orderslength = resp?.data.length || 0;
    }

  }

  async loadmorefriends(ev) {
    this.friendspage = this.friendspage + 1;
    await this.getfriends();
    setTimeout(() => {
      ev.target.complete();
    }, 700);
  }

  // async getNotifications() {
  //   let response = await this.network.getNotifications(1, 10);
  //   console.log('getNotifications response => ', response)
  //   this.notifications = response?.data?.data.map((item) => ({
  //     ...item,
  //     // hasUnread: self.sender_id === item.id,
  //     profile_image: this.image.getImageUrl(item?.notificationable?.addressee?.profile_image),
  //   }));
  //   console.log('this.notifications => ', this.notifications)
  //   this.notifications = response?.data?.data
  // }

  async getRecipeAlerts() {
    let response = await this.network.getRecipeAlerts(1, 10);
    this.loading = false;
    console.log('recipesAlerts response => ', response?.data?.data)
    response.message != '' && this.utility.presentSuccessToast(response.message);
    // this.recipesAlerts = response?.data?.data.map((item) => ({
    //   ...item,
    //   // hasUnread: self.sender_id === user.id,
    //   // profile_image: this.image.getImageUrl(user.profile_image),
    // }));
    // console.log('this.recipesAlerts => ', this.recipesAlerts)
    if (response?.data?.data) { this.recipesAlerts = response?.data?.data ? response?.data?.data : [] }
  }

  async getPostAlerts() {
    let response = await this.network.getPostAlerts(1, 10);
    this.loading = false;
    console.log('postAlerts response => ', response?.data?.data)
    response.message != '' && this.utility.presentSuccessToast(response.message);
    // this.postAlerts = response?.data?.data.map((item) => ({
    //   ...item,
    //   // hasUnread: self.sender_id === item.id,
    //   profile_image: this.image.getImageUrl(item.media_upload?.url),
    // }));
    // console.log('this.postAlerts => ', this.postAlerts)
    if (response?.data?.data) { this.postAlerts = response?.data?.data ? response?.data?.data : [] }
  }

  goToProfile() {
    this.users.getUser().then((user) => {
      this.nav.navigateTo('pages/profile', {
        queryParams: { user_id: user.id },
      });
    });
  }

  goToNotifications() {
    this.nav.navigateTo('pages/notifications');
  }

  async getNotifications() {
    this.loading = true;

    // localStorage.setItem('notifications_count', '0');
    var event = new Event('storageChange');
    window.dispatchEvent(event);

    let response = await this.network.getNotifications(1, 10);

    console.log('getNotifications response => ', response)
    const notiitems = response?.data?.data.map((notifi) => ({
      ...notifi,
      // hasUnread: self.sender_id === notifi.id,
      // content: notifi?.notificationable && (notifi?.notificationable?.user?.is_friend_requested && notifi?.notificationable?.user.name + ' sent you friend request' || notifi?.notificationable?.user?.is_friend && notifi?.notificationable?.user.name + ' accepted friend request'),
      profile_image: this.image.getImageUrl(notifi?.user?.profile_image),
    }));
    this.notifications = this.page != 1 ? [...this.notifications, ...notiitems] : notiitems;
    console.log('this.notifications => ', this.notifications)

    // this.notifications = []
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
    // console.log('this.currentFriends => ', this.notifications)
    // console.log('this.currentFriends[1].profile_image => ', this.notifications[1].profile_image)
    // this.notifications = response?.data?.data
    this.loading = false;
  }

  segmentChanged($event) {
    console.log('event.target.value => ', $event.target.value)
    if ($event.target.value == 'settings') {
      this.tab = $event.target.value;
      // this.goToProfile()
    } else if ($event.target.value == 'notifications') {
      this.tab = $event.target.value;
      // this.loading = true;
      this.getNotifications()
    } else if ($event.target.value == 'alert') {
      this.tab = $event.target.value;
      this.loading = true;
      this.getRecipeAlerts()
    } else {
      this.tab = $event.target.value;
    }
  }
  innerSegmentChanged($event) {
    this.innertab = $event.target.value;
    if (this.innertab == 'recipe') {
      this.loading = true;
      this.getRecipeAlerts();
    }
    else if (this.innertab == 'post') {
      this.loading = true;
      this.getPostAlerts();
    }
  }

  deleteAccount(item) {
    let data = this.network.deleteAccount(item);
    // this.nav.push('pages/login');
    // let res = await this.network.logout();
    this.users.removeToken();
    this.users.removeUser();
    this.nav.navigateTo('pages/login');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      // title: null,
      header: 'Delete Account',
      message: "Are you sure you want to delete your account? \nThis action is irreversible and your account cannot be recovered once deleted",
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // if (this.ProcActivo == false) {
          //   this.ProcActivo = true;
          // } else {
          //   this.ProcActivo = false;
          // }
          console.log('No')
        }
      },
      {
        text: 'Yes',
        handler: () => {
          console.log('Yes')
          this.deleteAccount('');
        }
      }
      ]
    });

    alert.present();
  }

  async blockUser() {
    let formData = new FormData();
    console.log('block user => ', this.user_id)
    formData.append('user_id', this.user_id);
    // alert(JSON.stringify(formData))
    // alert(JSON.stringify(this.user_id))
    var res = await this.network.blockUser(formData);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.modals.present(ChatBatsComponent);
      // this.nav.navigateTo('pages/chat-room');
    }
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


}
