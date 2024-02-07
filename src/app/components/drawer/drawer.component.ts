import { Component, Injector, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ViewWillEnter } from '@ionic/angular';
import { PLAN_TYPE } from 'src/app/data/const/enums';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { UserDetailComponentComponent } from 'src/app/pages/dating/user-detail-component/user-detail-component.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent extends BasePage implements OnInit {
  public appPages = [];
  user: any = {};
  packageId = 0;
  isEventSubscribed = false;
  isDatingEnabled = false;
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    this.getSetting()
    let islogin = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    this.appPages = this.dataService.getMenus();
    this.menuCtrl.swipeGesture(false, 'main');
    console.log('token => ', token);
    if (islogin && token) {
      const user = JSON.parse(islogin);
      console.log('islogin => ', user)
      // console.log('islogin => ', islogin)
      let userRes = await this.network.getUserProfile(user?.id);
      // let interestsRes = await this.network.getInterests();
      this.users.getNotificationCount()
      this.getStates();
      this.getInterests();
      console.log('res.data.user => ', userRes.data)
      // userRes.data.interests = interestsRes.data
      // userRes.data.profile_image = this.image.getImageUrl(userRes.data.profile_image)
      const fcmtoken = localStorage.getItem('fcm_token')
      console.log('drawer fcm_token => ', fcmtoken)
      // if (!fcmtoken) {
      if (Capacitor.getPlatform() !== 'web') {
        await this.network.setFcmToken(fcmtoken);
      }
      // }

      if (userRes?.data) {
        this.users.setUser(userRes.data);
        this.users.updateUserProfile({ ...userRes.data, profile_image: this.image.getImageUrl(userRes?.data?.profile_image) })
        localStorage.setItem('user', JSON.stringify(userRes.data));
        this.events.subscribe('USER_DATA_RECEIVED', async (data) => {
          console.log('USER_DATA_RECEIVED', data);
          this.packageId = userRes?.data?.user?.profile_detail?.package_id;
        });
      }



      const messagescount = localStorage.getItem('messages_count');
      console.log('messagescount => ', messagescount)
      if (messagescount == null) {
        localStorage.setItem('messages_count', '0');
        console.log('messagescount => ', Number(messagescount))
      } else {
        if (Number(messagescount) != 0) this.dataService.updateMessageCount(Number(messagescount));
        else this.dataService.updateMessageCount(0);

      }

      // console.log("localStorage.getItem('user'); => ", localStorage.getItem('user'))
    }
  }

  navigate(url) {
    this.packageId = this.user.profile_detail.package_id;

    console.log(url, this.packageId);
    switch (url) {
      case 'pages/ranch-locator':
        if (this.packageId != 1) {
          this.goto('pages/ranch-locator');
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }

        break;
      case 'pages/taxidermy':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/outfitters':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/chat-rooms':
        if (this.packageId) {
          this.goto(url);
        }
        break;
      case 'pages/recipes':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/post-adventure':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/store':
        if (this.packageId) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/dating':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/nationwide-laws':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/contact-us':
        if (this.packageId) {
          this.goto(url);
        }
        break;
      case 'pages/how-to':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/equipment-reviews':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;
      case 'pages/marketplace':
        if (this.packageId != 1) {
          this.goto(url);
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account.'
          );
        }
        break;

      default:
        this.goto(url);
        break;
    }
  }

  goto(url) {
    if (this.menuCtrl.isOpen) this.menuCtrl.toggle();
    this.nav.push(url);
  }

  async openUrl(item, isInternal = true) {
    this.menuCtrl.toggle();
    let token = localStorage.getItem('token');
    let url = item.externalUrl ? item.externalUrl : item.url;

    if (isInternal) {
      this.utility.openInternalUrl(url);
    } else {
      console.log(token);
      if (token) {
        console.log(url + '?token=' + token);
        if (url.includes('chat-loading')) {
          window.open(url + '?token=' + token, '_system');
        } else if (url.includes('dating')) {
          window.open(url + '?token=' + token, '_system');
        } else {
          if (url.includes('fws')) this.utility.openExternalUrl(url);
          // + '?token=' + token);
          else this.utility.openExternalUrl(url + '?token=' + token);
        }
      } else {
        this.utility.openExternalUrl(url);
      }
    }
  }

  async logout() {
    this.menuCtrl.toggle();
    const fcmtoken = localStorage.getItem('fcm_token')
    if (Capacitor.getPlatform() !== 'web') {
      let fcm = await this.network.deleteFcmToken(fcmtoken);
    }
    let res = await this.network.logout();
    this.users.removeToken();
    // localStorage.removeItem('fcm_token')
    localStorage.removeItem('userDataa');
    localStorage.removeItem('notifications_count');
    localStorage.removeItem('dating_tips_read');
    localStorage.setItem('messages_count', '0');
    this.users.removeUser();
    this.nav.push('pages/login');
    console.log(res);
  }

  async menuClicked(item) {
    console.log('menuClicked => ')
    this.user = await this.users.getUser();
    this.packageId = this.user.profile_detail.package_id;
    console.log('USER', this.user, item.role);

    if (item.url == 'pages/dating') {
      if (this.packageId != 1) {
        let flag = await this.datingEnable();
        this.isDatingEnabled = flag;
      } else {
        this.utility.presentFailureToast(
          'You are not allowed to view this page. Please upgrade your account.'
        );
      }
    }

    if (item.submenus) {
      console.log(item.submenus);
      item.isOpened = !item.isOpened;
    } else if (item.fireEvent) {
      this.events.publish(item.fireEvent);
      this.menuCtrl.toggle('main');
    } else if (item.needsCheck && !this.isDatingEnabled) {
      this.menuCtrl.toggle('main');
      this.editUser();
    } else if (item.externalUrl != null) this.openUrl(item, false);
    else if (item.internalUrl) this.openUrl(item);
    else this.navigate(item.url);
  }

  async checkMenus() {
    let isEnabled = await this.datingEnable();
    if (!isEnabled) {
      this.isDatingEnabled = false;
      this.appPages = this.dataService.getSpecificMenus(['Dating']);
      if (!this.isEventSubscribed) this.subscibeEvent();
    } else {
      this.appPages = this.dataService.getMenus();
      this.isDatingEnabled = true;
    }
  }

  async checkDatingEnabled() {
    this.isDatingEnabled = await this.datingEnable();
  }

  subscibeEvent() {
    this.events.subscribe('DRAWER_OPENED', () => {
      console.log('On DRAWER_OPENED');
      if (!this.isDatingEnabled) this.checkDatingEnabled();
    });
  }

  datingEnable() {
    return new Promise<boolean>(async (resolve) => {
      let res = await this.network.getUser();
      console.log('checkUser', res);

      if (
        res &&
        res.data &&
        res.data.user?.profile_detail &&
        !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
        res.data.user?.profile_detail.is_dating_profile
      ) {
        resolve(true);
        // this.openDatingChatRoom();
      } else resolve(false);
      //else this.editUser();
    });
  }

  async editUser() {
    this.user = await this.users.getUser();
    this.packageId = this.user.profile_detail.package_id;
    if (this.packageId === 3) {
      let data = await this.modals.present(UserDetailComponentComponent);
      console.log(data);
      if (data.data?.success) this.openDatingChatRoom();
    } else {
      this.utility.presentFailureToast(
        'You are not allowed to view this page. Please upgrade your account.'
      );
    }
  }

  async getSetting() {
    let res = await this.network.getSettings();
    this.dataService.updateSetting(res.data)
    console.log('drawer settings => ', res);
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log('States', res);
    this.users.updateStates(res && res.data ? res.data : [])
  }

  async getInterests() {
    let res = await this.network.getInterests();
    console.log('interestsList', res);
    this.users.interestsList = res.data
  }

  // async getNotificationCount() {
  //   const noticount = await this.network.getUnreadNotificationCount();
  //   console.log('getUnreadNotificationCount => ', noticount)
  //   this.dataService.updateNotificationsCount(noticount?.data?.count);
  //   // localStorage.setItem('notifications_count', noticount?.data?.count?.toString());
  //   // if (noticount?.data?.count) {
  //   // }
  // }


  // async getNotificationCount() {
  //   const noticount = await this.network.getUnreadMessageAndNotificationCount();
  //   console.log('getUnreadMessageAndNotificationCount => ', noticount)
  //   this.dataService.updateUnreadMessageAndNotificationCount(noticount?.data);
  //   this.dataService.updateNotificationsCount(noticount?.data?.unread_count);
  // }

  openDatingChatRoom() {
    this.nav.navigateTo('pages/dating');
  }

  getSubscriptionType() {
    return PLAN_TYPE.FREE;
  }
}
