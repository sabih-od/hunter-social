import { AfterViewInit, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ViewDidEnter } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-story-viewer',
  templateUrl: './story-viewer.page.html',
  styleUrls: ['./story-viewer.page.scss'],
})
export class StoryViewerPage extends BasePage implements OnInit, AfterViewInit, ViewDidEnter {
  activeIndex: number;
  @Input() item: any;
  @Input() tapped: any;
  @ViewChild('slides') slides: IonSlides;
  @ViewChild("progress") set progressElement(progress: any) {
    if (progress) {
      progress = progress.nativeElement;
      progress.addEventListener("animationend", () => { this.nextStoryItem(); });
      progress.addEventListener("webkitAnimationEnd", () => { this.nextStoryItem(); });
    }
  }
  @ViewChild("video") set videoElement(video: ElementRef) {
    if (video) {
      this.video = video.nativeElement;
      console.log('this.video => ', this.video)
      this.video.onwaiting = () => {
        console.log('this.video.onwaiting this.isWaiting => ', this.isWaiting)
        this.isWaiting = true;
      };
      this.video.onready = this.video.onload = this.video.onplaying = this.video.oncanplay = () => {
        console.log('this.video.oncanplay this.isWaiting => ', this.isWaiting);
        this.isWaiting = false;
      };

      this.video.addEventListener("loadedmetadata", async () => {
        let storyVideo = await this.getCurrentStoryItem();
        if (this.video.duration && !storyVideo.duration) storyVideo.duration = this.video.duration;
        this.video.play();
      });

    } else {
      if (this.video) this.video = null;
    }
  }

  stories = new Array<any>();
  userId: number = 1;
  isPaused: boolean = false;
  video: any;
  isWaiting: boolean = false;
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    const reels = this.dataService.getReels();
    this.stories = reels.map(story => ({
      ...story,
      items: story.items.map(item => ({
        ...item,
        date: this.utility.calculateTime(item.date)
      }))
    }))
    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleDark()
    }
    console.log('this.stories => ', this.stories)
    console.log('item => ', this.item)
    console.log('this.tapped => ', this.tapped)
  }

  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  ngAfterViewInit() {
    this.activeIndex = this.tapped;
    this.slides.slideTo(this.tapped)
  }

  closeStoryViewer() {
    this.modals.dismiss();
  }

  async getCurrentStory() {
    // console.log('this.stories[await this.slides.getActiveIndex()] => ', this.stories[await this.slides.getActiveIndex()])
    return this.stories[await this.slides.getActiveIndex()];
  }

  async nextStoryItem() {
    const currentStory = await this.getCurrentStory()
    // console.log('currentStory => ', currentStory)
    // console.log('currentStory.items => ', currentStory.items)
    if (currentStory.currentItem < currentStory.items.length - 1) {
      currentStory.currentItem++;
      this.setStorySeen();
    } else {
      const isEnd = await this.slides.isEnd();
      console.log('isEnd => ', isEnd)
      if (isEnd) {
        this.closeStoryViewer();
      } else {
        this.slides.slideNext();
      }
    }
  }

  pauseStory() {
    console.log('pause')
    this.isPaused = true;
    if (this.video) this.video.pause();
  }

  playStory() {
    console.log('pause')
    this.isPaused = false;
    if (this.video) this.video.play();
  }

  async getCurrentStoryItem() {
    let currentStory = await this.getCurrentStory();
    if (currentStory) {
      // let newstory = currentStory.items[currentStory.currentItem];
      // newstory.date = this.utility.calculateTime(newstory.date)
      // return newstory;
      return currentStory.items[currentStory.currentItem];
    }
  }

  async isLoading(indexStory: number) {
    let storyItem = await this.getCurrentStoryItem();
    const activeIndex = await this.slides.getActiveIndex();
    if (storyItem) {
      return !storyItem.duration && storyItem.type == 1 && indexStory === activeIndex;
    } else {
      return true;
    }
  }

  changeStoryItem(event: any, story: any) {
    if (event.center.y < 70 || event.center.y > this.platform.height() - 70) return;

    if (event.center.x < this.platform.width() / 2) {
      if (story.currentItem > 0) {
        story.currentItem--;

        this.setStorySeen();
      } else {
        this.slides.slidePrev();
      }
    } else {
      this.nextStoryItem();
    }
  }

  onSwipeUp() {
    console.log("Swipe Up!");
  }

  async setStorySeen() {
    this.activeIndex = await this.slides.getActiveIndex();
    let story = await this.getCurrentStory();
    let storyItem = await this.getCurrentStoryItem();

    if (!storyItem.seen) {
      if (story.currentItem === story.items.length - 1) story.seen = true;
      storyItem.seen = true;
    }
  }

  ionViewDidEnter() {
    this.setStorySeen();
  }

}
