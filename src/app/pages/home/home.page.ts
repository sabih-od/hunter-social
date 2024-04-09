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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePage implements OnInit {

  items;
  closed = false;
  loading = false;
  refresh = false;
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

  handleRefresh(event) {
    setTimeout(() => {
      this.getData();
      event.target.complete();
    }, 2000);
  }

  async getData() {
    this.loading = true;
    let res = await this.network.getPosts();
    // let user = await this.users.getUser();
    console.log('USER', this.user);

    console.log('response', res);
    if (res && res.data) {
      this.updateItems(res.data)
    }
    this.loading = false;
  }

  updateItems(data) {
    this.items = data.map((item) => ({
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

}
