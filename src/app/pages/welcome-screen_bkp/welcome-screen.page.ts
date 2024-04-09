import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.page.html',
  styleUrls: ['./welcome-screen.page.scss'],
})
export class WelcomeScreenPage extends BasePage implements OnInit {

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  login() {
    this.nav.navigateTo('pages/login');
  }
  register() {
    this.nav.navigateTo('pages/signup');
  }

}
