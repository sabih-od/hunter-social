import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { ChatBatsComponent } from 'src/app/components/chat-bats/chat-bats.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends BasePage implements OnInit {
  user_id: any;
  constructor(
    injector: Injector,
    private alertController: AlertController
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
  loading = false;
  current_user: any;
  orderslength = 0;

  async ngOnInit() {
    this.loading = true;
    this.getfriends()

    this.current_user = await this.users.getUser();
    this.user_id = this.current_user.id;

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
      this.friends = res?.data?.data.map((item) => ({
        ...item,
        // hasUnread: self.sender_id === item.id,
        profile_image: this.image.getImageUrl(item?.profile_image),
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

  segmentChanged($event) {
    console.log('event.target.value => ', $event.target.value)
    if ($event.target.value == 'settings') {
      this.tab = $event.target.value;
      // this.goToProfile()
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

}
