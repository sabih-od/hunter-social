import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-hunters',
  templateUrl: './hunters.component.html',
  styleUrls: ['./hunters.component.scss'],
})
export class HuntersComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  data;

  ngOnInit() {
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.hunters;
  }

  navigate(arg) {
    if (arg === 'post2') this.nav.push('pages/post-adventure');
  }
}
