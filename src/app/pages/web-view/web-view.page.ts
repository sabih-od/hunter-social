import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Config } from 'src/app/config/main.config';

@Component({
  selector: 'app-web-view',
  templateUrl: './web-view.page.html',
  styleUrls: ['./web-view.page.scss'],
})
export class WebViewPage implements OnInit {
  constructor(private iab: InAppBrowser) {}

  ngOnInit() {
    const browser = this.iab.create(Config.URL + 'public/', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }
}
