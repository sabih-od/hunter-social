import { Component, Injector, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends BasePage implements OnInit, ViewDidEnter {
  user_id: any;

  constructor(injector: Injector) {
    super(injector);
  }
  ionViewDidEnter(): void {
    console.log('ionViewDidEnter');
    this.events.publish('PROFILE_PAGE_ENTERED');
  }

  ngOnInit() {
    this.user_id = this.nav.getQueryParams()['user_id'];
  }
}
