import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { UserDetailComponentComponent } from '../../dating/user-detail-component/user-detail-component.component';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }


  userslimit = 0;
  usertoavail = 0;
  showpackage = false;

  async invite() {
    await Share.share({
      title: 'Install now and unleash your social adventure',
      text: 'Join the hunt for unforgettable moments with Hunters Social',
      url: Capacitor.getPlatform() == 'ios' ? 'https://appstoreconnect.apple.com/apps/1663547600/appstore' : 'https://play.google.com/store/apps/details?id=com.huntersocial.app',
      dialogTitle: 'Hunters Social',
    });
  }

  ngOnInit() {
    // this.getSetting();

    this.dataService.settings.subscribe((settings) => {
      if (settings) {
        this.userslimit = settings?.lifetime_users_limit;
        this.usertoavail = 5000 - this.userslimit
        if (this.userslimit == 0) {
          this.showpackage = true;
        }
      }
    });

  }

  async navigatetodating() {
    const user = await this.users.getUser();
    const packageId = user.profile_detail.package_id;

    let isDatingEnabled = false;
    if (packageId != 1) {
      isDatingEnabled = await this.datingEnable();

      if (!isDatingEnabled) {
        if (packageId === 3) {
          let data = await this.modals.present(UserDetailComponentComponent);
          if (data.data?.success) this.navigate('dating');
        } else {
          this.utility.presentFailureToast(
            'You are not allowed to view this page. Please upgrade your account 1.'
          );
          // this.navigate('edit-profile');
        }
      } else {
        this.navigate('dating');
      }

    } else {
      this.utility.presentFailureToast(
        'You are not allowed to view this page. Please upgrade your account 2.'
      );
      // this.navigate('edit-profile');
    }
  }

  datingEnable() {
    return new Promise<boolean>(async (resolve) => {
      let user = await this.users.getUser();
      if (
        user?.profile_detail &&
          !this.utility.isNullOrEmpty(user?.profile_detail.gender) &&
          user?.profile_detail.is_dating_profile == 1 ? true : false
      ) {
        resolve(true);
        // this.openDatingChatRoom();
      } else resolve(false);
      //else this.editUser();
    });
  }

  gotoChatBot() {
    const obj = {
      "id": "chatbot",
      // "email": "johnmartin@mailinator.com",
      "name": "Uncle Buck",
      // "created_at": "2023-01-20T17:40:57.000000Z",
      "profile_image": "https://hunterssocial.com/assets/images/udpate-logo.png",
      "hasUnread": false,
      "is_chatbot": true,
    }
    this.dataService.chat_data = obj;
    this.nav.push('pages/chat');
  }

  navigate(arg) {
    //arg == chat
    // if (arg === 'contact') this.nav.push('pages/contact-us');
    // else this.nav.push('pages/store');
    this.nav.push('pages/' + arg);

    // arg = bulb

    //if(arg === 'contact')

    //if((arg === 'bulb'){
    // navigate()
    // log()
    //}

    //if(arg === 'shop')

    //if()
    //else if()
    // else

    //if()
    //else if()
    //else if()
    //else
  }

  // async getSetting() {
  //   let res = await this.network.getSettings();
  //   if (res) {
  //     this.userslimit = res.data.lifetime_users_limit;
  //     this.usertoavail = 5000 - this.userslimit
  //     if (this.userslimit == 0) {
  //       this.showpackage = true;
  //     }
  //   }
  // }

}
