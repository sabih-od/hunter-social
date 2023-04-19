import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  navigate(arg) {
    //arg == chat
    if (arg === 'contact') this.nav.push('pages/contact-us');
    else this.nav.push('pages/store');

    // arg = bulb

    //if(arg === 'contact')

    //if((arg === 'bulb'){
    // navigate()
    // log()
    //}

    //if(arg === 'shop')

    //if()
    //else if()
    // else

    //if()
    //else if()
    //else if()
    //else
  }
}
