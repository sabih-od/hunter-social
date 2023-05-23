import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { EqipmentAddReviewComponent } from './eqipment-add-review/eqipment-add-review.component';
const reviews_data = require('../../data/reviews.json');

@Component({
  selector: 'app-equipment-reviews',
  templateUrl: './equipment-reviews.page.html',
  styleUrls: ['./equipment-reviews.page.scss'],
})
export class EquipmentReviewsPage extends BasePage implements OnInit {
  reviews;
  closed = false;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getData();
  }

  async getData() {
    let res = await this.network.getEquipments();
    if (res && res.data) this.reviews = res.data;
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  showReviews($event, item) {
    $event.stopPropagation();
    this.dataService.equipment = item;
    this.nav.push('pages/equipment-reviews-list');
  }

  async addReview(item) {
    const res = await this.modals.present(EqipmentAddReviewComponent, {
      equipment_id: item.id,
      item: item,
    });
  }

  close() {
    this.closed = true;
  }
}
