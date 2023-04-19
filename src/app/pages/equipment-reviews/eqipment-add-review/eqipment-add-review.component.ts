import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-eqipment-add-review',
  templateUrl: './eqipment-add-review.component.html',
  styleUrls: ['./eqipment-add-review.component.scss'],
})
export class EqipmentAddReviewComponent extends BasePage implements OnInit {
  rating: any = 5;
  comment: any;
  equipment_id: any;
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
      content: this.comment,
      rating: this.rating - 1,
      // product_id: this.product_id,
    };

    // const id = this.

    const res = await this.network.addEquipmentReview(this.equipment_id, data);

    // if (res.data) {
    //   this.utility.presentSuccessToast(res.message);
    // }

    this.modals.dismiss({
      res,
    });
  }

  changeRating(_rating) {
    this.rating = _rating + 1;
  }
}
