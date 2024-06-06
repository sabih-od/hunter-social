import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent extends BasePage implements OnInit {
  data;
  constructor(injector: Injector) {
    super(injector);
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.images;
  }

  ngOnInit() {}
}
