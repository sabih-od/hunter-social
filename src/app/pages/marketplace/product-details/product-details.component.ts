import { BasePage } from 'src/app/pages/base-page/base-page';
import { Component, OnInit, Input, Injector } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent extends BasePage implements OnInit {
  @Input() data: any;
  isMark = true;
  user_id: any;
  product_id: any;
  userID: any;

  constructor(Injector: Injector) {
    super(Injector);
  }

  async ngOnInit() {
    this.user_id = JSON.parse(await this.storage.get('user')).id;
    console.log('product data => ', this.data);

    if (this.data) {
      this.isMark = this.data.is_sold == 0 ? false : true;
      console.log('this.isMark => ', this.isMark)
      const proimage = this.image.getImageUrl(this.data?.user?.profile_image);
      this.data.user.profile_image = proimage;
    }

  }

  async mark(productid) {
    let res = await this.network.markAsSold(productid);
    console.log('mark res => ', res.data)
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
      this.modals.dismiss({ refresh: true })
    }
    console.log('res', res);
  }

  async opentosell(productid) {
    let res = await this.network.openToSell(productid);
    console.log('opentosell res => ', res.data)
    if (res && !Array.isArray(res.data)) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
      this.modals.dismiss({ refresh: true })
    }
    console.log('res', res);

  }


}
