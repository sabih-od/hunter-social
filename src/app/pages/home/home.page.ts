import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonTabs, ViewWillEnter } from '@ionic/angular';
import { PromotionsComponent } from 'src/app/components/promotions/promotions.component';
import { BasePage } from '../base-page/base-page';
import { Capacitor, Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;
import { PusherService } from 'src/app/services/pusher-service.service';
import { UserDetailComponentComponent } from '../dating/user-detail-component/user-detail-component.component';
import { Config } from 'src/app/config/main.config';
import { PostAdventureContentPage } from '../post-adventure-content/post-adventure-content.page';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StoriesAvatarSliderComponent } from 'src/app/components/stories-avatar-slider/stories-avatar-slider.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePage implements OnInit {
  @ViewChild(StoriesAvatarSliderComponent) storiesAvatarSliderComponent: StoriesAvatarSliderComponent;

  items;
  closed = false;
  loading = false;
  refresh = false;
  page = 1;
  next_page_url = null;
  user

  constructor(
    injector: Injector,
    private iab: InAppBrowser,
    private pusher: PusherService
  ) {
    super(injector);
    // this.callPusherService();
  }


  async ngOnInit() {
    // this.events.subscribe('UPDATE_POSTS', this.getData.bind(this));
    // this.events.subscribe('POST_ADDED', this.addPost.bind(this));
    this.events.subscribe('POST_DELETED', this.deletePost.bind(this));

    // this.events.subscribe('HOW_TO_POST_UPDATED', () => {
    //   console.log('uyyyyy686796789');
    //   this.getData();
    // });
    this.user = await this.users.getUser()
    console.log('this.user => ', this.user)
    this.loading = true;
    this.getData();
    if (Capacitor.getPlatform() !== 'web') {
      this.setStatusBarStyleLight()
    }
  }

  setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Light });
  };

  addPost(data) {
    // console.log('addPost POST_ADDED_data => ', data)
    data.comments = [];
    data.user = this.user
    this.items.unshift(data)
    // this.items = [...data, this.items]
    console.log('this.items => ', this.items)
    this.updateItems(this.items)
    console.log('this.items => ', this.items)
  }
  deletePost(data) {
    console.log('POST_DELETED_data => ', data)
    this.items = this.items.filter(x => x.id != data.data)
  }

  // handleRefresh(event) {
  //   setTimeout(() => {
  //     this.getData();
  //     event.target.complete();
  //   }, 2000);
  // }

  async getData() {
    let res = await this.network.getPosts(this.page);
    // let user = await this.users.getUser();
    console.log('USER', this.user);

    console.log('response', res);
    if (res && res.data) {
      if (res.data.next_page_url) this.next_page_url = res.data.next_page_url;
      this.updateItems(res.data.data)
    }
    this.loading = false;
    this.refresh = false;
  }

  updateItems(data) {
    const newposts = data.map((item) => ({
      ...item,
      created_at: this.utility.calculateTime(item.created_at),
      isMyPost: this.user.id === item.user_id,
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

  close() {
    console.log('Closed', closed);

    this.closed = true;
  }


  async callPusherService() {
    let token = localStorage.getItem('token');
    let user = await this.users.getUser();
    console.log('callPusherService => ', user);
    if (user) {
      this.users.setUser(user);
      // get post data
      this.pusher.globalChatNotify(token, user.id);
    } else {
      this.utility.presentFailureToast('Something went wrong');
      this.nav.push('pages/login');
    }
  }

  async create() {
    let res = await this.modals.present(PostAdventureContentPage);
    if (res && res?.data?.id) {
      console.log('res.data => ', res.data)
      console.log('POST_ADDED_data => ', res.data)
      this.addPost(res.data)
    }
    // console.log(res);
    // if (res && res.data.refresh) this.getData();
  }

  async initialize() {

  }


  async doRefresh($event) {
    this.page = 1;
    await this.getData();
    $event.target.complete();
    this.storiesAvatarSliderComponent.getData()
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
