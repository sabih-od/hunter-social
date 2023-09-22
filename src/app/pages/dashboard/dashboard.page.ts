import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends BasePage implements OnInit {

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  friends = [];
  notifications = [];
  recipesAlerts = [];
  postAlerts = [];
  sender_id = undefined;
  tab = 'friends';
  innertab = 'recipe';
  loading = false;

  ngOnInit() {
    this.loading = true;
    this.getfriends()
    // this.getNotifications()

    // this.getPostAlerts();
    // this.getRecipeAlerts();

  }

  async getfriends() {
    this.sender_id = this.dataService.dataId;
    let res = await this.network.getDashboardFriends(1, 10);
    this.loading = false;
    console.log('friends response => ', res?.data?.data)
    let self = this;
    if (res && res?.data?.data) {
      this.friends = res?.data?.data.map((user) => ({
        ...user,
        // hasUnread: self.sender_id === user.id,
        profile_image: this.image.getImageUrl(user?.profile_image),
      }));

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

    // this.friends = response?.data?.data.map((user) => ({
    //   ...user,
    //   // hasUnread: self.sender_id === user.id,
    //   profile_image: this.image.getImageUrl(user.profile_image),
    // }));
    console.log('this.friends => ', this.friends)
    // this.friends = response?.data?.data
  }

  // async getNotifications() {
  //   let response = await this.network.getNotifications(1, 10);
  //   console.log('getNotifications response => ', response)
  //   this.notifications = response?.data?.data.map((user) => ({
  //     ...user,
  //     // hasUnread: self.sender_id === user.id,
  //     profile_image: this.image.getImageUrl(user?.notificationable?.addressee?.profile_image),
  //   }));
  //   console.log('this.notifications => ', this.notifications)
  //   this.notifications = response?.data?.data
  // }

  async getRecipeAlerts() {
    let response = await this.network.getRecipeAlerts(1, 10);
    this.loading = false;
    console.log('recipesAlerts response => ', response?.data?.data?.data)
    // this.recipesAlerts = response?.data?.data.map((item) => ({
    //   ...item,
    //   // hasUnread: self.sender_id === user.id,
    //   // profile_image: this.image.getImageUrl(user.profile_image),
    // }));
    // console.log('this.recipesAlerts => ', this.recipesAlerts)
    if (response?.data?.data?.data) { this.recipesAlerts = response?.data?.data.data }
  }

  async getPostAlerts() {
    let response = await this.network.getPostAlerts(1, 10);
    this.loading = false;
    console.log('postAlerts response => ', response?.data?.data)
    // this.postAlerts = response?.data?.data.map((item) => ({
    //   ...item,
    //   // hasUnread: self.sender_id === item.id,
    //   profile_image: this.image.getImageUrl(item.media_upload?.url),
    // }));
    // console.log('this.postAlerts => ', this.postAlerts)
    if (response?.data?.data) { this.postAlerts = response?.data?.data }
  }

  goToProfile() {
    this.users.getUser().then((user) => {
      this.nav.navigateTo('pages/profile', {
        queryParams: { user_id: user.id },
      });
    });
  }

  segmentChanged($event) {
    console.log('event.target.value => ', $event.target.value)
    if ($event.target.value == 'settings') {
      this.goToProfile()
    }else if ($event.target.value == 'alert') {
      this.tab = $event.target.value;
      this.loading = true;
      this.getRecipeAlerts()
    }else{
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
}
