import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { StoryViewerPage } from 'src/app/pages/story-viewer/story-viewer.page';
import { CreateStoryComponent } from '../create-story/create-story.component';
import { CreateStoryPage } from 'src/app/pages/create-story/create-story.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-stories-avatar-slider',
  templateUrl: './stories-avatar-slider.component.html',
  styleUrls: ['./stories-avatar-slider.component.scss'],
})
export class StoriesAvatarSliderComponent extends BasePage implements OnInit {

  user_image;


  user
  stories = []
  constructor(injector: Injector, private sanitizer: DomSanitizer) {
    super(injector);
  }

  sanitizeImageUrl(url: string): SafeResourceUrl {
    const basePath = 'https://hunterssocial.com/storage/uploads/';
    const sanitizedUrl = basePath + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  async ngOnInit() {
    this.setUserImage();
    this.getData()
    // this.stories = this.stories.map(story => ({
    //   ...story,
    //   items: story.items.map(item => ({
    //     ...item,
    //     date: this.utility.calculateTime(item.date)
    //   }))
    // }))
  }

  async getData() {
    this.stories = await this.network.getStories() // this.dataService.getReels();
    this.stories = this.stories["data"].data;
    this.stories = this.stories.filter(story => story.items.length > 0);

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
  
    let res = await this.modals.present(StoryViewerPage, { item: item, tapped: index, stories: this.stories });
    this.stories = res.data.stories;
    // if (res && res.data.refresh){}
  }

  async createreel() {
    let res = await this.modals.present(CreateStoryPage);
    await this.getData(); // Call getData if refresh flag is true
  }
}
