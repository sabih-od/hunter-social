import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage extends BasePage implements OnInit {

  orders = [];
  loading = false;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getOrders();
    this.loading = true;
  }

  async getOrders() {
    const res = await this.network.getUserOrders();
    console.log('getUserOrders => ', res)
    this.loading = false;
    if (res && res.data) {
      this.orders = res.data;
    }
  }

}
