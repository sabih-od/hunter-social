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

  imagePreview: string;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.products();
    this.onFilter(); 
  }
  createListing() {
    this.modals.present(CreateListingPage).then(res => {
      console.log('CreateListingPage res => ', res)
      if (res?.data?.refresh) {
        this.products();
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

  async products() {
    console.log('user', this.userId);
    this.user();
    // let data = await this.network.getMyProducts({id:this.userId})
    let data = await this.network.getMyProducts();
    console.log('this is', data);
    this.productList = data.data; 
  }

  async myListing() {
    console.log('user', this.userId);
    // this.user();
    let data = await this.network.getMyListing({ id: this.userId });
    console.log('this is mylisting', data);
    this.productList = data;
  }

  async getProducts(item) {
    console.log('id', item.id);
    this.selectedCategoryId = item.id;
    // let data = await this.network.getProductss({query:null,category_id:item.id})
    let data = await this.network.getProductss();
    console.log('filter', data);
    this.filterProducts = data.data;
    this.productList = this.filterProducts;
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
  async onTopInput(event: any) {
    this.topSearch = event.target.value;
    // console.log('top value', this.searchTerm);
    // let data = await this.network.getProductss({
    //   query: this.topSearch,
    //   category_id: null,
    // });
    if(this.topSearch.length == 0){
      this.products();
      this.onFilter();
    }
    if (this.topSearch.length > 3) {
      let data = await this.network.getSearch({
        category_id: this.selectedCategoryId,
        query: this.topSearch,
      });
      this.productList = data.data;
      console.log('filter', data);
    }

  }

  details(item: any) {
    console.log('prodct detail', item);
    let data = item;
    this.modals.present(ProductDetailsComponent, {
      data,
    }).then(res => {
      if (res?.data?.refresh) {
        this.products();
        this.onFilter();
      }
    });
  }
}
