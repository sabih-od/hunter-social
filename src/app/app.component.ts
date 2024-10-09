import { Component, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ModalController, Platform } from '@ionic/angular';
import { BasePage } from './pages/base-page/base-page';
import { NavService } from './services/basic/nav.service';
import { FirebaseService } from './services/firebase.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
// import { SqliteService } from './services/sqlite.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isModalOpen;
  versionNumber;
  // newIOSVersionNumber = "3.6";
  // newAndroidVersion = "1.2"
  currentVersion = "1.38";
  // versionCode;

  constructor(
    private router: Router,
    public utility: UtilityService,
    private modalController: ModalController,
    public platform: Platform,
    public fcm: FirebaseService,
    public users: UserService,
    // private sqlite: SqliteService,
    private zone: NgZone,
    private appVersion: AppVersion,
    private badge: Badge,
    private alertController: AlertController,
    private inAppBrowser: InAppBrowser

  ) {
    platform.ready().then(() => {

      // if (this.platform.is('cordova')) {
      // if (this.platform.is('ios')) {
      //   this.checkForUpdate();
      // }
      // this.initialize();

    });
    document.addEventListener(
      'backbutton',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const url = this.router.url;
        this.createBackRoutingLogics(url);
      },
      false
    );
    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleLight()
    }
  }


  async checkForUpdate() {
    try {
      // const currentVersion = await this.appVersion.getVersionNumber();
      // const currentVersion = '1.32'; 
      if (this.platform.is('ios')) {
        const appStoreUrl = 'https://itunes.apple.com/lookup?bundleId=com.hunterssocial.app';

        const response = await fetch(appStoreUrl);
        const data = await response.json();

        if (data.results.length > 0) {
          const latestVersion = data.results[0].version;
          if (latestVersion !== this.currentVersion) {
            this.presentAlert();
          }
        }
      }
    } catch (error) {
      console.error('Error checking for update', error);
    }
  }


  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  initialize() {

    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleLight()
    }

    if (
      this.platform.is('cordova') ||
      this.platform.is('ios') ||
      this.platform.is('android')
    ) {
      this.initializeApp();
    }
  }

  onPause() {
    // Handle the pause event
  }
  onResume() {
    // Handle the pause event
    this.users.getNotificationCount()
  }
  initializeApp() {
    console.log('--------------------init')
    document.addEventListener("pause", this.onPause, false);
    document.addEventListener("resume", this.onResume.bind(this), false);

    this.platform.ready().then(async () => {
      // this.badge.clear();
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2
          const domain = 'hunterssocial.com'
          const slug = event.url.split(domain).pop();
          if (slug) {
            this.router.navigateByUrl(slug);
          }
          // If no match, do nothing - let regular routing
          // logic take over
        });
      });

      // this.sqlite
      //   .initialize()
      //   .then(() => {
      //   })
      //   .catch((err) => alert(err));
      // let permStatus = await PushNotifications.checkPermissions();

      await this.fcm.setupFMC();
    });


  }

  async createBackRoutingLogics(url) {
    if (
      url.includes('login') ||
      url.includes('signup') ||
      url.includes('dashboard') ||
      url.includes('home') ||
      url.includes('tutorial') ||
      url.includes('stripe-payment')
    ) {
      this.utility.hideLoader();

      const isModalOpen = await this.modalController.getTop();
      if (isModalOpen) {
        this.modalController.dismiss({ data: 'A' });
      } else {
        this.exitApp();
      }
    } else {
      if (this.isModalOpen) {
      }
    }
  }

  // checkAppUpdates() {
  //   if (this.platform.is('ios') && this.versionNumber != this.newIOSVersionNumber) {
  //     this.presentAlert();
  //   }
  //   if (this.platform.is('android') && this.versionNumber != this.newAndroidVersion) {
  //     this.presentAlert();
  //   }
  // }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'app-update-alert',
      header: 'App Update',
      // subHeader: 'A Sub Header Is Optional',
      message: 'There is a newer version of this app available',
      buttons: [{
        text: 'Update Now',
        role: 'update',
        handler: () => {
          let appStoreURL = '';
          if (this.platform.is('ios')) {
            appStoreURL = `https://apps.apple.com/lv/app/hunters-social/id1663547600`;
          } else {
            appStoreURL = `https://play.google.com/store/apps/details?id=com.huntersocial.app`;
          }
          // this.inAppBrowser.create(appStoreURL, '_system');
          const browser = this.inAppBrowser.create(appStoreURL, '_system');
          browser.show();
        },
      },],
    });

    await alert.present();
  }

  exitApp() {
    navigator['app'].exitApp();
  }
}
