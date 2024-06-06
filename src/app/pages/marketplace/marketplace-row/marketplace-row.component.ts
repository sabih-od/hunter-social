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
  // @Input() item;
  filter: any;
  searchTerm: string = '';
  productList: any[] = [];
  categories: any[] = [];
  filterProducts: any[] = [];
  item: any;
  userId;
  category_id;
  category: any[] = [];
  imageFormControl;
  image_url: any;
  selected: any;
  data: any;
  _img;
  user_image;
  user_id;
  topSearch;
  selectedCategoryId: any = null;

  page = 1;
  isMyProductListing = false;
  loading = false;
  refresh = false;
  states = []
  state_id = ""
  shouldloadmore = true;
  next_page_url = null;

  imagePreview: string;
  constructor(injector: Injector) {
    super(injector);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  ngOnInit() {
    this.getProducts(null);
    this.onFilter();
    this.getStates();
  }

  createListing() {
    this.modals.present(CreateListingPage).then(res => {
      if (res?.data?.refresh) {
        this.getProducts(null)
        this.onFilter();
      }
    })
    // this.nav.navigateTo('pages/create-listing');
  }

  async user() {
    let data = await this.network.getUser();
    this.userId = data.data.user.id;
  }

  // async products() {
  //   this.isMyProductListing = true;
  //   this.user();
  //   // let data = await this.network.getMyProducts({id:this.userId})
  //   let data = await this.network.getMyProducts();
  //   this.productList = data.data.data;
  // }

  async getStates() {
    let res = await this.users.states.subscribe(states => {
      this.states = states;
    });
    // this.states = res.data;
  }

  async myListing(item) {
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
    }
    if (item?.id) this.selectedCategoryId = item?.id;

    // this.user();
    // let data = await this.network.getMyListing({ id: this.userId });
    const params = {
      query: this.topSearch,
      category_id: this.selectedCategoryId,
      state_id: this.state_id
    }
    let response = await this.network.getMyListing(params, this.page);
    if (response?.data?.data?.length == 0) this.shouldloadmore = false; else this.shouldloadmore = true;
    this.loading = false;
    // this.productList = response.data.data;
    this.productList = this.page == 1 ? response.data.data : [...this.productList, ...response.data.data];
  }

  async getProducts(item) {
    this.loading = true;


    if (this.isMyProductListing) {
      this.isMyProductListing = false;
      this.productList = [];
      this.page = 1;
      this.next_page_url = null;
    }

    if (item?.id) {
      this.productList = [];
      this.page = 1;
      this.next_page_url = null;
    }
    if (item?.id) this.selectedCategoryId = item?.id;
    // let data = await this.network.getProductss({query:null,category_id:item.id})
    const params = {
      query: this.topSearch,
      category_id: this.selectedCategoryId,
      state_id: this.state_id
    }
    let res = await this.network.getProductss(params, this.page);
    if (res.data.next_page_url) { this.next_page_url = res.data.next_page_url; } else { this.next_page_url = null; }
    // if (res?.data?.data?.length == 0) this.shouldloadmore = false; else this.shouldloadmore = true;
    this.loading = false;
    if (this.eventref) {
      this.eventref.target.complete();
    }
    // this.filterProducts = res.data.data;
    this.productList = this.page == 1 ? res.data.data : [...this.productList, ...res.data.data];
  }

  async onFilter() {
    let data = await this.network.getCategories(this.searchTerm);
    this.categories = data;
  }
  onInput(event: any) {
    this.searchTerm = event.target.value;
  }
  timeToken;
  async onTopInput(event: any) {
    this.topSearch = event.target.value;
    this.page = 1;
    // let data = await this.network.getProductss({
    //   query: this.topSearch,
    //   category_id: null,
    // });
    if (this.topSearch.length == 0) {
      if (this.isMyProductListing) this.myListing(null)
      else this.getProducts(null)
      // this.onFilter();
    }
    if (this.topSearch.length > 3) {
      if (this.timeToken) clearTimeout(this.timeToken);
      this.timeToken = setTimeout(() => {
        if (this.isMyProductListing) this.myListing(null)
        else this.getProducts(null)
      }, 1000);
      // let data = await this.network.getProductss({
      //   category_id: this.selectedCategoryId,
      //   query: this.topSearch,
      // });
      // this.productList = data.data;
    }

  }

  details(item: any) {
    let data = item;
    this.modals.present(ProductDetailsComponent, {
      data,
    }).then(res => {
      if (res?.data?.refresh) {
        this.getProducts(null)
        // this.onFilter();
      }
    });
  }

  eventref = null;

  onIonInfinite($event) {
    this.eventref = $event;
    if (this.next_page_url != null) {
      this.page = this.page + 1;
      if (this.isMyProductListing) this.myListing(null)
      else this.getProducts(null)
      // this.onFilter();
      // setTimeout(() => {
      //   $event.target.complete();
      //   // (ev as IonInfiniteScrollContent).target.complete();
      // }, 500);
    } else {
      $event.target.complete();
    }
  }

}
