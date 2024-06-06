import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { Config } from 'src/app/config/main.config';
import { AddReviewComponent } from '../../equipment-reviews-list/add-review/add-review.component';
@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent extends BasePage implements OnInit {
  @Input() item;
  url: any;
  constructor(injector: Injector) {
    super(injector);
    this.url = Config.URL;
  }

  ngOnInit() {}

  async editReview(item) {
    await this.modals.present(AddReviewComponent, {
      reviewItem: item,
      tag: 'edit',
    });
    this.events.publish('UPDATE_REVIEWS');
  }
  async deleteReview() {
    let res = await this.network.deleteReview(this.item.id);
    if (res && res.data) {
      this.utility.presentSuccessToast('Review deleted successfully!');
      this.events.publish('UPDATE_REVIEWS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }
  viewProfile(user_id) {
    this.nav.push('pages/profile', { user_id });
  }
}
