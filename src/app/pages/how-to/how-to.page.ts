import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular';

@Component({
  selector: 'app-how-to',
  templateUrl: './how-to.page.html',
  styleUrls: ['./how-to.page.scss'],
})
export class HowToPage extends BasePage implements OnInit {
  list = [];
  search_text: string;
  loading = true;
  page = 1;

  onSearchTextChange(searchText: string) {
    this.search_text = searchText;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.events.subscribe('HOW_TO_POST_UPDATED', () => {
      // this.getData();
    });
    this.getData();
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getData();
      event.target.complete();
    }, 2000);
  }
  async getData() {
    let res = await this.network.howToVideos(this.page);
    if (res.data.data.length > 0) {
      console.log('howToVideos', res);
      let user = await this.users.getUser();
      if (res && res.data) {
        let listdata = res.data.data.map((item) => ({
          ...item,
          user: {
            ...item.user,
            profile_image: this.users.getProfileImage(item.user?.profile_image),
          },
          selfPost: item.user_id === user.id,
        }));
        console.log('listdata => ', listdata)
        this.list = [...this.list, ...listdata]
        console.log('this.list => ', this.list)
      } else {
        this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
      }
      this.loading = false
    } else {

      this.loading = false
    }
  }

  onIonInfinite(ev) {
    this.page = this.page + 1;
    this.getData();
    setTimeout(() => {
      ev.target.complete();
      // (ev as IonInfiniteScrollContent).target.complete();
    }, 500);
  }

}
