import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CreateListingPage } from '../create-listing/create-listing.page';

@Component({
  selector: 'app-marketplace-row',
  templateUrl: './marketplace-row.component.html',
  styleUrls: ['./marketplace-row.component.scss'],
})
export class MarketplaceRowComponent extends BasePage implements OnInit {
  filter: any;
  event: any;
  searchTerm: string = '';
  productList: any[] = [];
  categories: any[] = [];
  filterProducts: any[] = [];
  userId: any;
  category_id: any;
  category: any[] = [];
  image_url: any;
  selectedCategoryId: any = null;
  page: number = 1;
  isMyProductListing: boolean = false;
  loading: boolean = false;
  refresh: boolean = false;
  states: any[] = [];
  state_id: string = "";
  shouldloadmore: boolean = true;
  next_page_url: string | null = null;
  imagePreview: string = '';
  topSearch: string = '';

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getProducts(null);
    this.onFilter();
    this.getStates();
  }

  async createListing() {
    this.nav.navigateTo('pages/create-listing');
  }

  async user() {
    try {
      const data = await this.network.getUser();
      this.userId = data.data.user.id;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async getStates() {
    try {
      const states = await this.users.states.toPromise();
      this.states = states;
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  }

  async myListing(item?) {
    this.selectedCategoryId = null;
    this.loading = true;
    if (!this.isMyProductListing) {
      this.isMyProductListing = true;
      this.productList = [];
      this.page = 1;
    }

    if (item?.id) {
      this.productList = [];
      this.page = 1;
      this.selectedCategoryId = item.id;
    }

    const params = {
      query: this.topSearch,
      category_id: this.selectedCategoryId,
      state_id: this.state_id,
    };

    try {
      const response = await this.network.getMyListing(params, this.page);
      this.shouldloadmore = response.data.data.length !== 0;
      this.productList = this.page === 1 ? response.data.data : [...this.productList, ...response.data.data];
    } catch (error) {
      console.error('Error fetching my listing:', error);
    } finally {
      this.loading = false;
    }
  }

  async getProducts(event?) {
    if (event) {
      this.event = event.target.value;
    }

    this.loading = true;

    if (this.isMyProductListing) {
      this.isMyProductListing = false;
      this.productList = [];
      this.page = 1;
      this.next_page_url = null;
    }

    if (this.event?.id === null) {
      this.selectedCategoryId = null;
    } else if (this.event?.id) {
      this.selectedCategoryId = this.event.id;
      this.productList = [];
      this.page = 1;
      this.next_page_url = null;
    }

    const params = {
      query: this.topSearch,
      category_id: this.selectedCategoryId,
      state_id: this.state_id,
    };

    try {
      const res = await this.network.getProductss(params, this.page);
      this.next_page_url = res.data.next_page_url || null;
      this.productList = this.page === 1 ? res.data.data : [...this.productList, ...res.data.data];
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.loading = false;
      if (this.eventref) {
        this.eventref.target.complete();
      }
    }
  }

  async onFilter() {
    try {
      const data = await this.network.getCategories(this.searchTerm);
      this.categories = data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  onInput(event: any) {
    this.searchTerm = event.target.value;
  }

  timeToken: any;

  async onTopInput(event: any) {
    this.topSearch = event.target.value;
    this.page = 1;

    if (this.topSearch.length === 0) {
      this.isMyProductListing ? this.myListing(null) : this.getProducts(null);
    }

    if (this.topSearch.length > 3) {
      if (this.timeToken) clearTimeout(this.timeToken);
      this.timeToken = setTimeout(() => {
        this.isMyProductListing ? this.myListing(null) : this.getProducts(null);
      }, 1000);
    }
  }

  details(item: any) {
    const data = item;
    this.modals.present(ProductDetailsComponent, { data }).then((res) => {
      if (res?.data?.refresh) {
        this.getProducts(null);
      }
    });
  }

  eventref: any = null;

  onIonInfinite($event: any) {
    this.eventref = $event;
    if (this.next_page_url) {
      this.page += 1;
      this.isMyProductListing ? this.myListing(null) : this.getProducts(null);
    } else {
      $event.target.complete();
    }
  }
}
