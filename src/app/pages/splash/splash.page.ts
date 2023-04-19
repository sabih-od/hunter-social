import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage extends BasePage implements OnInit {
  bgLoaded = false;
  showLogo = false;
  fullbackground;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.initialize();
  }

  async initialize() {
    const res = await this.dataService.getSplashImages();
    this.fullbackground = res.image;
    setTimeout(() => {
      this.showLogo = true;
      // this.nav.push('pages/login');
      setTimeout(async () => {
        let token = localStorage.getItem('token');
        if (token && token != '1') {
          console.log('TOKEN iS ', token);

          let isAuthenticated = await this.users.getIsAuthenticated();
          if (isAuthenticated) {
            this.navigate('home');
            this.menuCtrl.enable(true, 'main');
          } else {
            console.log('Navigating to login');
            this.navigate('login');
          }
        } else this.navigate('login');
      }, 3000);
    }, 1000);
  }

  navigate(page) {
    this.nav.push(`pages/${page}`);
  }

  updateBackgroundView() {
    this.bgLoaded = true;
  }
}
