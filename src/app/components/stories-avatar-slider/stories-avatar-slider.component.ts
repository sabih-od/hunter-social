import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { StoryViewerPage } from 'src/app/pages/story-viewer/story-viewer.page';
import { CreateStoryComponent } from '../create-story/create-story.component';
import { CreateStoryPage } from 'src/app/pages/create-story/create-story.page';

@Component({
  selector: 'app-stories-avatar-slider',
  templateUrl: './stories-avatar-slider.component.html',
  styleUrls: ['./stories-avatar-slider.component.scss'],
})
export class StoriesAvatarSliderComponent extends BasePage implements OnInit {

  user_image;


  user
  stories = []
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    this.setUserImage();
    this.stories = this.dataService.getReels();
  }

  async setUserImage() {
    this.user = await this.users.getUser();
  }

  slideOpts = {
    slidesPerView: 6.5,
    spaceBetween: 10,

    // freeMode: true,
    coverflowEffect: {
      // rotate: 50,
      // stretch: 0,
      // depth: 100,
      // modifier: 1,
      slideShadows: false,
    }
  }

  async openreel(item, index) {
    // console.log('openreel index => ', index);
    let res = await this.modals.present(StoryViewerPage, { item: item, tapped: index });
    console.log('StoryViewerPage res => ', res);
    // if (res && res.data.refresh){}
  }

  async createreel() {
    console.log('createreel => ')
    let res = await this.modals.present(CreateStoryPage);
    console.log(res);
    // if (res && res.data.refresh) this.getData();
  }

}
