import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent extends BasePage implements OnInit {
  @Input() item;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  async deleteReview() {
    let res = await this.network.deleteReview(this.item.id);
    console.log('deleteReview', res);
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
