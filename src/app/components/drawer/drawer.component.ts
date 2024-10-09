import { Component, Injector, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Badge } from '@ionic-native/badge/ngx';
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
  constructor(injector: Injector, private badge: Badge) {
    super(injector);
  }

  async ngOnInit() {
    this.getSetting()
    let islogin = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    this.appPages = this.dataService.getMenus();
    this.menuCtrl.swipeGesture(false, 'main');
    if (islogin && token) {
      const user = JSON.parse(islogin);      
      let userRes = await this.network.getUserProfile(user?.id);
      // let interestsRes = await this.network.getInterests();
      this.users.getNotificationCount()
      this.getStates();
      this.getInterests();
      this.getTagQuestions();
      this.getEthnicities();
      // userRes.data.interests = interestsRes.data
      // userRes.data.profile_image = this.image.getImageUrl(userRes.data.profile_image)
      const fcmtoken = localStorage.getItem('fcm_token')
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
          this.packageId = userRes?.data?.user?.profile_detail?.package_id;
        });
      }



      const messagescount = localStorage.getItem('messages_count');
      if (messagescount == null) {
        localStorage.setItem('messages_count', '0');
      } else {
        if (Number(messagescount) != 0) this.dataService.updateMessageCount(Number(messagescount));
        else this.dataService.updateMessageCount(0);

      }
      
    }
  }

  navigate(url) {
    this.packageId = this.user.profile_detail.package_id;

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
      if (token) {
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
    console.log('FCM Token:', fcmtoken); // Debugging
    if (Capacitor.getPlatform() !== 'web') {
        let fcm = await this.network.deleteFcmToken(fcmtoken);
        console.log('FCM Token Deleted:', fcm); // Debugging
    }
    let res = await this.network.logout();
    console.log('Logout Response:', res); // Debugging
    this.users.removeToken();
    this.badge.clear();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userDataa');
    localStorage.removeItem('notifications_count');
    localStorage.removeItem('dating_tips_read');
    localStorage.setItem('messages_count', '0');
    this.users.removeUser();
    this.nav.push('login');
}


  async menuClicked(item) {
    this.user = await this.users.getUser();
    this.packageId = this.user.profile_detail.package_id;

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
      if (!this.isDatingEnabled) this.checkDatingEnabled();
    });
  }

  datingEnable() {
    return new Promise<boolean>(async (resolve) => {
      let res = await this.network.getUser();

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
  }

  async getTagQuestions() {
    const res = await this.network.getQuestions();
    this.users.updateTagQuestions(res && res.data ? res.data : [])
  }

  async getEthnicities() {
    const res = await this.network.getQuestions();
    const ethnicities = ['Alaska Native', 'Asian', 'African American', 'Hispanic', 'Native Hawaiian', 'White'];
    this.users.updateEthnicities(ethnicities)
  }

  async getStates() {
    let res = await this.network.getStates();
    this.users.updateStates(res && res.data ? res.data : [])
  }

  async getInterests() {
    let res = await this.network.getInterests();
    this.users.interestsList = res.data
  }

  

  openDatingChatRoom() {
    this.nav.navigateTo('pages/dating');
  }

  getSubscriptionType() {
    return PLAN_TYPE.FREE;
  }
}
