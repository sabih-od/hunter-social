import { Component, Injector, OnInit } from '@angular/core';
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
  user = {};
  isEventSubscribed = false;
  isDatingEnabled = false;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.appPages = this.dataService.getMenus();
    this.menuCtrl.swipeGesture(false, 'main');
    this.events.subscribe('USER_DATA_RECEIVED', async (data) => {
      console.log('USER_DATA_RECEIVED', data);
      this.user = await this.users.getUser();
    });
    // this.user = this.dataService.getUser();
  }

  navigate(url) {
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
    this.nav.push('pages/login');
    let res = await this.network.logout();
    this.users.removeToken();
    this.users.removeUser();
    console.log(res);
  }

  async menuClicked(item) {
    console.log('Subscribe now', item);
    this.user = await this.users.getUser();
    console.log('USER', this.user, item.role);
    // if (item.role > this.user['role_id']) {
    //   alert(
    //     'You are not allowed to view this page, Please upgrade your account'
    //   );
    //   return;
    // }

    if (item.url == 'pages/dating') {
      // await this.utility.showLoader();
      let flag = await this.datingEnable();
      this.isDatingEnabled = flag;
      // await this.utility.hideLoader();
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
    let data = await this.modals.present(UserDetailComponentComponent);
    console.log(data);
    if (data.data?.success) this.openDatingChatRoom();
  }

  openDatingChatRoom() {
    this.nav.navigateTo('pages/dating');
  }

  getSubscriptionType() {
    return PLAN_TYPE.FREE;
  }
}
