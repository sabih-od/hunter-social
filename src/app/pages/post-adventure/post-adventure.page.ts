import { Component, Injector, OnInit } from '@angular/core';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../base-page/base-page';
import { PostAdventureContentPage } from '../post-adventure-content/post-adventure-content.page';

@Component({
  selector: 'app-post-adventure',
  templateUrl: './post-adventure.page.html',
  styleUrls: ['./post-adventure.page.scss'],
})
export class PostAdventurePage extends BasePage implements OnInit {
  items;
  closed = false;
  loading = false;
  refresh = false;
  page = 1;
  next_page_url = null;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.events.subscribe('HOW_TO_POST_UPDATED', () => {
      this.getData();
    });
    // this.events.subscribe('UPDATE_POSTS', this.getData.bind(this));
    //this.items = this.dataService.getAdventres();
    this.loading = true;
    this.getData();
  }

  // handleRefresh(event) {
  //   setTimeout(() => {
  //     // Any calls to load data go here
  //     this.getData();
  //     event.target.complete();
  //   }, 2000);
  // }

  async getData() {
    let res = await this.network.getPosts(this.page);
    let user = await this.users.getUser();
  

  
    if (res && res.data) {
      if (res.data.next_page_url) this.next_page_url = res.data.next_page_url;
      const newposts = res.data.data.map((item) => ({
        ...item,
        created_at: this.utility.calculateTime(item.created_at),
        isMyPost: user.id === item.user_id,
        user: {
          ...item.user,
          profile_image: item.user.profile_image
            ? this.image.getImageUrl(item.user.profile_image)
            : Config.URL + 'public/assets/images/ph-avatar.png',
        },
        isVideo: this.image.isVideo(item.media_upload.mime_type),
        // videoPath:
        //   item.media_upload.url && item.media_upload.url.includes('blob')
        //     ? URL.createObjectURL(item.media_upload)
        //     : '',
      }));
      this.items = this.page == 1 ? newposts : [...this.items, ...newposts];
    }
    this.loading = false;
  }

  async addNew() {
    let res = await this.modals.present(PostAdventureContentPage);
  
    if (res && res.data.refresh) this.getData();
  }

  close() {
  
    this.closed = true;
  }

  async doRefresh($event) {
    this.page = 1;
    await this.getData();
    $event.target.complete();
  }

  async onIonInfinite(ev) {
    if (this.next_page_url != null) {
      this.page = this.page + 1;
      await this.getData();
      ev.target.complete();
      // setTimeout(() => {
        
      //   // (ev as IonInfiniteScrollContent).target.complete();
      // }, 500);
    } else {
      ev.target.complete();
    }
  }
}
