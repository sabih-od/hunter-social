import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage extends BasePage implements OnInit {
  cart: any;
  id;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    const res = await this.network.getCart();
    this.cart = res.data;
    console.log(this.cart);
    this.id = this.nav.getQueryParams()?.id;
  }

  updateQty($event) {
    console.log($event);

    var key = $event.key;
    var it = $event.item;
    if (key == 'add') {
      this.add(it);
    }

    if (key == 'remove') {
      this.remove(it);
    }

    if (key == 'sub') {
      this.sub(it);
    }
  }

  async add(item) {
    if (item.qty < item.product.qty) {
      item.qty++;
      let res = await this.network.increaseDecrese(this.getCartItemData(item));
      console.log(res);
      this.init();
    }
  }

  async sub(item) {
    if (item.qty > 1) {
      item.qty--;
      let res = await this.network.increaseDecrese(
        this.getCartItemData(item),
        false
      );
      console.log(res);
      this.init();
    }
  }

  async remove(item) {
    let res = await this.network.increaseDecreseRemove(
      this.getCartItemData(item)
    );
    this.init();
  }

  proceed() {
    this.dataService.cart = this.cart;
    this.nav.push('pages/billing-address');
  }

  getData(item) {
    return { id: this.id, quantity: item.qty };
  }

  getCartItemData(item) {
    return { id: item.product.id, quantity: 1 };
  }
}
