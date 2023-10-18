import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.page.html',
  styleUrls: ['./product-review.page.scss'],
})

export class ProductReviewPage extends BasePage implements OnInit {
  rating: any = 5;
  comment: any;
  product_id: any;
  review: any;
  user: any;

  constructor(injector: Injector) {
    super(injector);
  }
  

  async ngOnInit() {
    console.log('review', this.review);
    if (this.review) {
      this.setReviewForEdit();
    }
    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
    }
  }

  setReviewForEdit() {
    this.comment = this.review.comment;
    this.rating = this.review.rating;
  }

  dismiss() {
    this.modals.dismiss({ reload: true });
  }

  async submit() {
    if (this.review) {
      let data = {
        id: this.review.id,
        comment: this.comment,
        rating: this.rating,
        product_id: this.product_id,
      };
      const res = await this.network.editProductReview(this.review.id, data);
      if (res.data) {
        this.dismiss()
        this.utility.presentSuccessToast(res.message);
      }
    } else {
      let data = {
        comment: this.comment,
        rating: this.rating,
        product_id: this.product_id,
      };
      const res = await this.network.addProductReview(data);
      if (res.data) {
        this.dismiss()
        this.utility.presentSuccessToast(res.message);
      }
    }
  }

  changeRating(_rating) {
    console.log('_rating => ', _rating) 
    this.rating = _rating;
  }
}
