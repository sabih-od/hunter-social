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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isModalOpen;
  versionNumber;
  newIOSVersionNumber = "3.6";
  newAndroidVersion = "1.2"
  // versionCode;

  constructor(
    private router: Router,
    public utility: UtilityService,
    private modalController: ModalController,
    public platform: Platform,
    public fcm: FirebaseService,
    // private sqlite: SqliteService,
    private zone: NgZone,
    private appVersion: AppVersion,
    private badge: Badge,
    private alertController: AlertController,
    private inAppBrowser: InAppBrowser

  ) {
    platform.ready().then(() => {


      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then(res => {
          console.log('getVersionNumber => ', res);
          this.versionNumber = res;
          // this.checkAppUpdates()
          // console.log('this.versionNumber => ', this.versionNumber);
        }).catch(error => {
          console.log(error);
        });
        // this.appVersion.getVersionCode().then(res => {
        //   console.log('getVersionCode => ', res);
        //   this.versionCode = res;
        // }).catch(error => {
        //   console.log(error);
        // });

      }
      this.initialize();

    });
    document.addEventListener(
      'backbutton',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const url = this.router.url;
        console.log(url);
        this.createBackRoutingLogics(url);
      },
      false
    );
    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleDark()
    }
  }

  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  // setStatusBarStyleLight = async () => {
  //   await StatusBar.setStyle({ style: Style.Light });
  // };

  initialize() {

    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleDark()
    }

    if (
      this.platform.is('cordova') ||
      this.platform.is('ios') ||
      this.platform.is('android')
    ) {
      this.initializeApp();
    }
  }

  initializeApp() {
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
      //     console.log('sqlite initialized');
      //   })
      //   .catch((err) => alert(err));
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
      console.log(isModalOpen);
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

  checkAppUpdates() {
    console.log('this.versionNumber => ', this.versionNumber)
    if (this.platform.is('ios') && this.versionNumber != this.newIOSVersionNumber) {
      this.presentAlert();
    }
    if (this.platform.is('android') && this.versionNumber != this.newAndroidVersion) {
      this.presentAlert();
    }
  }

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
          console.log('update app now')
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
