import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { ProductReviewPage } from '../product-review/product-review.page';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage extends BasePage implements OnInit {
  id: any;
  product_detail: any;
  quantity = 1;
  reviews: any[];
  user;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.id = await this.nav.getQueryParams().product_id;
    const res = await this.network.getProductDetail(this.id);
    const review_res = await this.network.getProductReviews(this.id);
    this.reviews = review_res.data;
    this.product_detail = res.data;

    this.user = await this.users.getUser();
  }

  async openAddReview() {
    let res = await this.modals.present(ProductReviewPage, { product_id: this.id });
    if (res && res.data.reload) {
      const review_res = await this.network.getProductReviews(this.id);
      this.reviews = review_res.data;
    }
  }

  async openEditReview(review) {
    let res = await this.modals.present(ProductReviewPage, { product_id: this.id, review: review });
    // let res = await this.modals.present(AddRecipeComponent);
    if (res && res.data.reload) {
      const review_res = await this.network.getProductReviews(this.id);
      this.reviews = review_res.data;
    }
  }

  add() {
    if (this.quantity < this.product_detail.qty) {
      this.quantity++;
    }
  }

  sub() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async deleteProductReview(reviewid) {
    this.utility.showLoader()
    const res = await this.network.deleteProductReview(reviewid);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      const review_res = await this.network.getProductReviews(this.id);
      this.reviews = review_res.data;
      // this.product_detail = res.data;
    }
  }

  async addToCart() {
    const data = {
      quantity: this.quantity,
      id: this.id,
    };

    const res = await this.network.addToCart(data);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.nav.push('pages/cart', { id: this.nav.getQueryParams().product_id });
    }
  }
}
