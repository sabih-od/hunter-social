import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent extends BasePage implements OnInit {
  rating = 1;
  review = '';
  item;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.item = this.dataService.equipment;
  }

  changeRating(_rating) {
    this.rating = _rating + 1;
  }

  async addReview() {
    if (this.utility.isNullOrEmpty(this.review) || this.rating === 1) {
      this.utility.presentFailureToast('Please add review & give rating');
      return;
    }
    let data = {
      content: this.review,
      rating: this.rating - 1,
    };
    let res = await this.network.addReview(data, this.item.id);
    console.log(res, 'addReview');
    if (res && res.data) {
      this.utility.presentSuccessToast('Review posted successfully!');
      this.close(true);
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  close(refresh) {
    this.modals.dismiss({ refresh });
  }
}
