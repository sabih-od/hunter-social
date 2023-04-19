import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrls: ['./logos.component.scss'],
})
export class LogosComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  data;

  ngOnInit() {
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.logos;
  }
}
