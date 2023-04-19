import { Component, Injector, Input, OnInit } from '@angular/core';
import { ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-profile-ui',
  templateUrl: './profile-ui.component.html',
  styleUrls: ['./profile-ui.component.scss'],
})
export class ProfileUIComponent extends BasePage implements OnInit {
  @Input() user_id: any;
  user_profile: any;
  posts: any;
  posts_count: any;
  connections_count: any;
  next_page: any;
  current_user: any;
  isOwnProfile: any;
  state;
  city;
  item: any;
  user: any;
  user_image: any;

  constructor(injector: Injector) {
    super(injector);
    console.log(Config);
  }

  async ngOnInit() {
    this.initialize();
    this.events.subscribe('PROFILE_PAGE_ENTERED', this.initialize.bind(this));
  }
  ionViewWillEnter(): void {
    this.getUser();
  }
  async initialize() {
    this.getUser();
    this.current_user = await this.users.getUser();
    this.isOwnProfile = this.current_user.id == this.user_id;
    console.log(this.isOwnProfile);
    const user_profile_data = await this.network.getUserProfile(this.user_id);
    this.user_profile = user_profile_data.data;
    if (this.isOwnProfile) this.dataService.user_data = this.user_profile;
    const posts_count_data = await this.network.getPostCount(this.user_id);
    this.posts_count = posts_count_data.data.count;
    const connections_count_data = await this.network.getConnectionCount(
      this.user_id
    );
    this.connections_count = connections_count_data.data.count;
    this.getUserPosts();
    this.getStates();
  }

  async getUser() {
    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.user = res.data.user;
      console.log('this.user', this.user);

      if (this.user['profile_image'] && this.user['profile_image'] !== '')
        console.log('hello');

      this.user_image = this.image.getImageUrl(this.user['profile_image']);
      console.log('user_image', this.user_image);

      console.log('hello1');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }
  async getUserPosts(paginate = false) {
    const { data } = await this.network.getUserPosts(this.user_id);
    console.log(data);
    this.posts = data.data.map((item: any) => ({
      ...item,
      isMyPost: this.current_user.id === item.user_id,
      created_at: this.utility.calculateTime(item.created_at),
      user: {
        ...item.user,
        profile_image: item.user?.profile_image
          ? this.image.getImageUrl(item.user.profile_image)
          : Config.URL + 'public/assets/images/ph-avatar.png',
      },
      isVideo: this.image.isVideo(item.media_upload.mime_type),
    }));
  }

  itemClicked(item: { url: any }) {
    if (item.url) this.nav.push(item.url);
  }

  async getStates() {
    let res = await this.network.getStates();
    console.log('getStates', res);
    console.log(this.user_profile);
    let states =
      res && res.data
        ? res.data.filter(
            (x) =>
              x.id == parseInt(this.user_profile.profile_detail.state ?? '0')
          )
        : [];

    this.state = states && states.length > 0 ? states[0].name : 'N/A';
    if (this.state && this.state !== '')
      this.getCities(parseInt(this.user_profile.profile_detail.state));
  }

  async getCities(id) {
    let res = await this.network.getCities(id);
    console.log(res);
    if (res && res.data) {
      let cities =
        res && res.data
          ? res.data.filter(
              (x) =>
                x.id == parseInt(this.user_profile.profile_detail.city ?? '0')
            )
          : [];

      this.city = cities && cities.length > 0 ? cities[0].name : 'N/A';
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  gotoSubscription() {
    this.nav.navigateTo('pages/subscription');
  }
  // deleteAccount(){
  //   let data = this.network.logout()
  //   this.nav.navigateTo('pages/login')

  // }
  deleteAccount(item) {
    let data = this.network.deleteAccount(item);
    // this.nav.push('pages/login');
    // let res = await this.network.logout();
    this.users.removeToken();
    this.users.removeUser();
    console.log(data);
    this.nav.navigateTo('pages/login');
  }

  imageUrl() {
    return (
      Config?.URL + 'public/storage/uploads/' + this.user_profile?.profile_image
    );
  }
}
