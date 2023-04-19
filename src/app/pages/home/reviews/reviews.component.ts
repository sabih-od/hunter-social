import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }
  data;

  ngOnInit() {
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.reviews;
  }
}
