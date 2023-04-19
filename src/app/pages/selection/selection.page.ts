import { Component, Injector, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage extends BasePage implements OnInit {
  constructor(injector: Injector, private iab: InAppBrowser) {
    super(injector);
  }

  ngOnInit() {}

  openWebview() {
    const browser = this.iab.create(Config.URL + 'public/', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }

  editProfile() {
    this.nav.push('pages/edit-profile');
  }
}
