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
  @Input() reviewItem: any;
  @Input() tag: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    console.log(this.reviewItem);

    this.item = this.dataService.equipment;
    if (this.tag == 'edit') {
      this.review = this.reviewItem.content;
      this.rating = this.reviewItem.rating;
    }
  }

  changeRating(_rating) {
    this.rating = _rating + 1;
  }

  async addReview() {
    if (this.tag != 'edit') {
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
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    } else {
      let data = new FormData();
      data.append('_method', 'put');
      data.append('content', this.review);
      data.append('rating', String(this.rating));
      let res = await this.network.editreview(data, this.reviewItem.id);
      console.log(res, 'addReview');
      if (res && res.data) {
        this.utility.presentSuccessToast('Review updated successfully!');
        this.close(true);
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }
  async updateReview() {
    let data = new FormData();
    data.append('_method', 'put');
    data.append('content', this.review);
    data.append('rating', String(this.rating - 1));
    const res = await this.network.editreview(data, this.item.id);
    console.log(res);
  }

  close(refresh) {
    this.modals.dismiss({ refresh });
  }
}
