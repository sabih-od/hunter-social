import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

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
      // console.log('subscribe => ', settings)
      if (settings) {
        this.userslimit = settings?.lifetime_users_limit;
        this.usertoavail = 5000 - this.userslimit
        if (this.userslimit == 0) {
          this.showpackage = true;
        }
      }
    });

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
