import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage extends BasePage implements OnInit {
  stores = [];
  loading = true;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    // this.stores = this.dataService.getStores();
    this.getData();
  }

  async getData() {
    let res = await this.network.getProducts();
    if (res && res.data) {
      this.loading = false;
      this.stores = res.data;
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
      this.loading = false;
    }
  }

  openStore(id) {
    this.nav.navigateTo('pages/store/product-detail', {
      queryParams: { product_id: id },
    });
    // this.utility.openInternalUrl(`store/${id}`);
  }
  
}
