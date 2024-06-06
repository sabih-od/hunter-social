import { AfterViewInit, Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ViewDidEnter } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
      this.video.onwaiting = () => {
        this.isWaiting = true;
      };
      this.video.onready = this.video.onload = this.video.onplaying = this.video.oncanplay = () => {
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
    private sanitizer: DomSanitizer
  ) {
    super(injector);
  }

  sanitizeImageUrl(url: string): SafeResourceUrl {
    const basePath = 'https://hunterssocial.com/storage/uploads/';
    const sanitizedUrl = basePath + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  ngOnInit() {

    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleDark()
    }
  }

  setStatusBarStyleDark = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  };

  ngAfterViewInit() {
    this.activeIndex = this.tapped;
    this.slides.slideTo(this.tapped)
  }

  closeStoryViewer() {
    if (this.video) this.video.pause();
    this.modals.dismiss({ stories: this.stories });
  }

  async getCurrentStory() {
    return this.stories[await this.slides.getActiveIndex()];
  }

  async nextStoryItem() {
    const currentStory = await this.getCurrentStory()
    if (this.video) this.video.pause();
    if (currentStory.currentItem < currentStory.items.length - 1) {
      currentStory.currentItem++;
      this.setStorySeen();
    } else {
      const isEnd = await this.slides.isEnd();
      if (isEnd) {
        this.closeStoryViewer();
      } else {
        this.slides.slideNext();
      }
    }
  }

  async prevStoryItem() {
    const currentStory = await this.getCurrentStory();
    if (this.video) this.video.pause();
  
    if (currentStory.currentItem > 0) {
      currentStory.currentItem--;
      this.setStorySeen();
    } else {
      const isBeginning = await this.slides.isBeginning();
      if (!isBeginning) {
        this.slides.slidePrev();
        // If you want to set the last item of the previous story as seen when going back
        const prevStory = await this.getCurrentStory();
        prevStory.currentItem = prevStory.items.length - 1;
        this.setStorySeen();
      } else {
        // If you're at the beginning of the first story, you might want to handle this case accordingly
        // Maybe close the story viewer or loop to the end of the last story
      }
    }
  }
  
  pauseStory() {
    this.isPaused = true;
    if (this.video) this.video.pause();
  }

  playStory() {
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
    if (!event || !event.center || !this.platform || !this.platform.width()) return;
  
    const screenWidth = this.platform.width();
  
    if (event.center.y < 70 || event.center.y > this.platform.height() - 70) return;
  
    if (event.center.x < screenWidth / 2) {
      // Tapped on the left side, go to previous slide
      if (story.currentItem > 0) {
        story.currentItem--;
        this.setStorySeen();
      } else {
        this.slides.slidePrev();
      }
    } else {
      // Tapped on the right side, go to next slide
      this.nextStoryItem();
    }
  }
  
  async setStorySeen() {
    this.activeIndex = await this.slides.getActiveIndex();
    let story = await this.getCurrentStory();
    let storyItem = await this.getCurrentStoryItem();
    if (!storyItem.seen) {
      if (story.currentItem === story.items.length - 1) {
        story.seen = true;
      }
      storyItem.seen = true;
    }
  }

  ionViewDidEnter() {
    this.setStorySeen();
  }
  
}
