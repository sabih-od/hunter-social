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
  }

  async mark(productid) {
    let res = await this.network.markAsSold(productid);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
    }
    console.log('res', res);
  }

  async opentosell(productid) {
    let res = await this.network.openToSell(productid);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
    }
    console.log('res', res);
    
  }
  

}
