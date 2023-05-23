import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { BasePage } from './pages/base-page/base-page';
import { NavService } from './services/basic/nav.service';
import { FirebaseService } from './services/firebase.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isModalOpen;

  constructor(
    private router: Router,
    public utility: UtilityService,
    private modalController: ModalController,
    public platform: Platform,
    public fcm: FirebaseService,
    private sqlite: SqliteService
  ) {
    platform.ready().then(() => {
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
  }

  initialize() {
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
      this.sqlite
        .initialize()
        .then(() => {
          console.log('sqlite initialized');
        })
        .catch((err) => alert(err));
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

  exitApp() {
    navigator['app'].exitApp();
  }
}
