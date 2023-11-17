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
  states = []
  state_id = ""
  shouldloadmore = true;

  imagePreview: string;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getProducts(null);
    this.onFilter();
    this.getStates();
  }
  createListing() {
    this.modals.present(CreateListingPage).then(res => {
      console.log('CreateListingPage res => ', res)
      if (res?.data?.refresh) {
        this.getProducts(null)
        this.onFilter();
      }
    })
    // this.nav.navigateTo('pages/create-listing');
    console.log('jshdlkjsh');
  }
  async user() {
    let data = await this.network.getUser();
    console.log('user id', data.data.user.id);
    this.userId = data.data.user.id;
  }

  // async products() {
  //   this.isMyProductListing = true;
  //   console.log('user', this.userId);
  //   this.user();
  //   // let data = await this.network.getMyProducts({id:this.userId})
  //   let data = await this.network.getMyProducts();
  //   console.log('this is products', data);
  //   this.productList = data.data.data;
  // }
  async getStates() {
    let res = await this.users.states.subscribe(states => {
      this.states = states;
      console.log('this.states => ', this.states);
    });
    // console.log('getStates', res);
    // this.states = res.data;
  }
  async myListing(item) {
    console.log('user', this.userId);
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
    console.log('category id', item?.id);
    console.log('selectedCategoryId id', this.selectedCategoryId);
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
    console.log('this is mylisting', response.data.data);
    // this.productList = response.data.data;
    this.productList = this.page == 1 ? response.data.data : [...this.productList, ...response.data.data];
    console.log('this is mylisting this.productList => ', this.productList);
  }

  async getProducts(item) {
    this.loading = true;


    if (this.isMyProductListing) {
      this.isMyProductListing = false;
      this.productList = [];
      this.page = 1;
    }

    if (item?.id) {
      this.productList = [];
      this.page = 1;
    }
    console.log('category id', item?.id);
    console.log('selectedCategoryId id', this.selectedCategoryId);
    if (item?.id) this.selectedCategoryId = item?.id;
    // let data = await this.network.getProductss({query:null,category_id:item.id})
    const params = {
      query: this.topSearch,
      category_id: this.selectedCategoryId,
      state_id: this.state_id
    }
    let response = await this.network.getProductss(params, this.page);
    if (response?.data?.data?.length == 0) this.shouldloadmore = false; else this.shouldloadmore = true;
    this.loading = false;
    console.log('filter', response);
    // this.filterProducts = response.data.data;
    this.productList = this.page == 1 ? response.data.data : [...this.productList, ...response.data.data];
    console.log('this.productList => ', this.productList);
  }

  async onFilter() {
    let data = await this.network.getCategories(this.searchTerm);
    console.log('this is', data);
    this.categories = data;
  }
  onInput(event: any) {
    this.searchTerm = event.target.value;
    console.log('sdaskjdhasjdlkjh', this.searchTerm);
  }
  timeToken;
  async onTopInput(event: any) {
    this.topSearch = event.target.value;
    this.page = 1;
    // console.log('top value', this.searchTerm);
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
      // console.log('filter', data);
    }

  }

  details(item: any) {
    console.log('prodct detail', item);
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


  onIonInfinite($event) {
    this.page = this.page + 1;
    if (this.isMyProductListing) this.myListing(null)
    else this.getProducts(null)
    // this.onFilter();
    setTimeout(() => {
      $event.target.complete();
      // (ev as IonInfiniteScrollContent).target.complete();
    }, 500);
  }

}
