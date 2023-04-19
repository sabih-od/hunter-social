import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.page.html',
  styleUrls: ['./product-review.page.scss'],
})
export class ProductReviewPage extends BasePage implements OnInit {
  rating: any;
  comment: any;
  product_id: any;
  user: any;

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
    }
  }

  dismiss() {
    this.modals.dismiss();
  }

  async submit() {
    let data = {
      comment: this.comment,
      rating: this.rating - 1,
      product_id: this.product_id,
    };

    const res = await this.network.addProductReview(data);

    if (res.data) {
      this.utility.presentSuccessToast(res.message);
    }
  }

  changeRating(_rating) {
    this.rating = _rating + 1;
  }
}
