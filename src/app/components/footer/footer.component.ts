import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BasePage implements OnInit {
  settings: {}
  constructor(injector: Injector,
    public network: NetworkService,
    public appVersion: AppVersion) {
    super(injector);
  }
  @Input() linksVisible = true;
  @Input() forpage: string;

  links;
  versionNumber;

  ngOnInit() {
    this.init();
  }

  init() {
    this.links = this.dataService.getFooterLinks();
    this.getSetting();
  }

  navigate(page) {
    this.nav.push('pages/' + page);
  }

  async getSetting() {
    this.dataService.settings.subscribe((settings) => {      
      if (settings) {
        this.settings = settings
      }
    });
    // let res = await this.network.getSettings();
    // this.dataService.updateSetting(res.data)    
    // if (res && res.data) {
    //   this.settings = res.data
    // }
  }

}
