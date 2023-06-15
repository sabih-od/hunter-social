import { Component, Injector, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { AddReviewComponent } from './add-review/add-review.component';

@Component({
  selector: 'app-equipment-reviews-list',
  templateUrl: './equipment-reviews-list.page.html',
  styleUrls: ['./equipment-reviews-list.page.scss'],
})
export class EquipmentReviewsListPage extends BasePage implements OnInit {
  reviewList: any;
  next_page: any;
  current_page = 1;
  loading: boolean = true;
  isLoading = false;
  videos = [];

  constructor(injector: Injector) {
    super(injector);
  }

  ionViewWillEnter() {
    console.log('fdsafdsafdsafdsafdsa');
  }

  async addNew() {
    let res = await this.modals.present(AddReviewComponent);
    console.log(res, 'addNew');

    if (res && res.data?.refresh) this.getData();
  }

  ngOnInit() {
    this.events.subscribe('UPDATE_REVIEWS', this.getData.bind(this, false));
    this.getData();
    this.loading = false;
  }

  async getData(paginate = false) {
    let item = this.dataService.equipment;

    let res = await this.network.getEquipmentReviews(
      item.id,
      this.current_page
    );

    this.network.getEquipmentShow(item.id).then((data) => {
      console.log(data);
      if (data.data) {
        let f = data.data;
        this.videos = f.videos;
      }
    });

    console.log(res);

    if (res && res.data) {
      let user = await this.users.getUser();

      const list = res.data.data.map((x: any) => ({
        ...x,
        canDelete: user?.id === x.user_id,
        profile_image: this.users.getProfileImage(x.user?.profile_image ?? ''),
        time: this.utility.calculateTime(x.created_at),
      }));
      if (!paginate) {
        this.reviewList = list;
      } else {
        this.reviewList = this.reviewList.concat(list);
      }
      this.current_page = res.data.current_page;
      if (res.data.next_page_url) {
        const split_string = res.data.next_page_url.split('?page=');
        this.next_page = parseInt(split_string[1]);
        this.current_page = this.next_page;
      } else {
        this.next_page = null;
      }
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }

  async loadData($event: any) {
    if (this.next_page) {
      await this.getData(true);
    }
    $event.target.complete();
  }
  async doRefresh($event) {
    this.isLoading = true;
    await this.getData();
    $event.target.complete();
    this.isLoading = false;
  }
}
