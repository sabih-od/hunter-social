import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  data;

  ngOnInit() {
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.about_us;
  }

  navigate(arg) {
    if (arg === 'post1') this.nav.push('pages/post-adventure');
  }
}
