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
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.events.subscribe('HOW_TO_POST_UPDATED', () => {
      console.log('uyyyyy686796789');
      this.getData();
    });
    // this.events.subscribe('UPDATE_POSTS', this.getData.bind(this));
    //this.items = this.dataService.getAdventres();
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
    let res = await this.network.getPosts();
    let user = await this.users.getUser();
    console.log('USER', user);

    console.log('response', res);
    if (res && res.data) {
      this.items = res.data.map((item) => ({
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
    }
  }

  async addNew() {
    let res = await this.modals.present(PostAdventureContentPage);
    console.log(res);
    if (res && res.data.refresh) this.getData();
  }

  close() {
    console.log('Closed', closed);

    this.closed = true;
  }
}
