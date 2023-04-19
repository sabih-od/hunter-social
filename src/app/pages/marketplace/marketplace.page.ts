import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage extends BasePage implements OnInit {
  stores;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.stores = this.dataService.getStores();
  }

  openStore(id) {
    // this.nav.navigateTo('pages/store/product-detail', {
    //   queryParams: { product_id: id },
    // });
    // this.utility.openInternalUrl(`store/${id}`);
    
  }
}
