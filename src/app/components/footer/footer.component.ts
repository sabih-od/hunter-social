import { Component, Injector, Input, OnInit } from '@angular/core';
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
    public network: NetworkService) {
    super(injector);
  }
  @Input() linksVisible = true;

  links;

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

  async getSetting(){
    let res = await this.network.getSettings();
    console.log('settings => ', res);
    if(res && res.data){
      this.settings = res.data
    }
  }

}
