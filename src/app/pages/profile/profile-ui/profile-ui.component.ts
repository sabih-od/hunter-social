import { Component, Injector, Input, OnInit } from '@angular/core';
import { ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../../base-page/base-page';
import { ReportPage } from '../../report/report.page';
import { ChatBatsComponent } from 'src/app/components/chat-bats/chat-bats.component';

@Component({
  selector: 'app-profile-ui',
  templateUrl: './profile-ui.component.html',
  styleUrls: ['./profile-ui.component.scss'],
})
export class ProfileUIComponent extends BasePage implements OnInit {
  @Input() user_id: any;
  user_profile: any;
  posts: any;
  // posts_count: any;
  // connections_count: any;
  next_page: any;
  current_user: any;
  isOwnProfile: any;
  state;
  city;
  item: any;
  user: any;
  user_image: any;
  profileLoading = true;

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    // this.initialize();
    this.events.subscribe('PROFILE_PAGE_ENTERED', this.initialize.bind(this));
  }
  ionViewWillEnter(): void {
    // this.getUser();
  }

  questions = [];
  tag_option_ids = [];
  communication;
  love;
  education;
  zodiac;
  async getTagQuestions() {
    this.users.tagQuestions.subscribe(data => {
      if (data) {
        // this.questions = data.map(ques => ques.tag_options.filter(opt => this.tag_option_ids.includes(opt.id)))
        this.questions = data.map((ques) => {
          return {
            label: ques.label,
            content: ques.content,
            tag_options: ques.tag_options.filter(opt => {
              return this.tag_option_ids.includes(opt.id)
            })
          }
        });

        // this.communication = data[0].tag_options.filter(x => this.tag_option_ids.includes(x.id))
        // this.love = data[1].tag_options.filter(x => this.tag_option_ids.includes(x.id))
        // this.education = data[2].tag_options.filter(x => this.tag_option_ids.includes(x.id))
        // this.zodiac = data[3].tag_options.filter(x => this.tag_option_ids.includes(x.id))
      }
    });

  }
  async initialize() {
    // this.getUser();
    this.current_user = await this.users.getUser();
    this.isOwnProfile = this.current_user.id == this.user_id;
    if (!this.isOwnProfile) {
      const user_profile_data = await this.network.getUserProfile(this.user_id);
      user_profile_data.data.profile_image = this.image.getImageUrl(user_profile_data.data.profile_image)
      this.user_profile = user_profile_data.data;
      this.profileLoading = false
    } else {
      this.user_profile = this.current_user
      this.profileLoading = false
      this.tag_option_ids = this.user_profile.tag_selections.map(x => x.tag_option_id)
      this.getTagQuestions();
    }

    // this.users.userprofile.subscribe(profile => {
    // })

    if (this.isOwnProfile) this.dataService.user_data = this.user_profile;
    // const posts_count_data = await this.network.getPostCount(this.user_id);
    // this.posts_count = posts_count_data.data.count;
    // const connections_count_data = await this.network.getConnectionCount(
    //   this.user_id
    // );
    // this.connections_count = connections_count_data.data.count;
    this.getUserPosts();
    // this.getStates();
  }

  async getUser() {
    let userRes = await this.network.getUser();
    if (userRes && userRes.data && userRes.data.user) {
      this.user = userRes.data.user;

      if (this.user['profile_image'] && this.user['profile_image'] !== '')
      if (this.isOwnProfile) {
        this.user_image = this.user['profile_image'] == null ? '../../../assets/Images/dummy-avatar.png' : this.image.getImageUrl(this.user['profile_image']);
      } else {
        this.user_image = this.user_profile?.profile_image == null ? '../../../assets/Images/dummy-avatar.png' : this.image.getImageUrl(this.user_profile?.profile_image);
      }

    } else
      this.utility.presentFailureToast(userRes?.message ?? 'Something went wrong');
  }
  async getUserPosts(paginate = false) {
    const { data } = await this.network.getUserPosts(this.user_id);
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
    if (res && res.data) {
      let cities =
        res && res.data
          ? res.data.filter(
            (x) =>
              x.id == parseInt(this.user_profile.profile_detail.city ?? '0')
          )
          : [];

      this.city = cities && cities.length > 0 ? cities[0].name : 'N/A';
    }
    // else
    //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  gotoSubscription() {
    this.nav.navigateTo('pages/subscription');
  }
  // deleteAccount(){
  //   let data = this.network.logout()
  //   this.nav.navigateTo('pages/login')

  // }
  deleteAccount(item) {
    // let data = this.network.deleteAccount(item);
    // // this.nav.push('pages/login');
    // // let res = await this.network.logout();
    // this.users.removeToken();
    // this.users.removeUser();
    // this.nav.navigateTo('pages/login');
  }

  imageUrl() {
    return (
      Config?.URL + 'public/storage/uploads/' + this.user_profile?.profile_image
    );
  }

  async openreport() {
    var res = await this.modals.present(ReportPage, {
      tag: 'user',
      item_id: this.user_profile.id,
      item_desc: this.user_profile.name,
    });
  }

  async blockUser() {
    let formData = new FormData();
    formData.append('user_id', this.user_id);
    // alert(JSON.stringify(formData))
    // alert(JSON.stringify(this.user_id))
    var res = await this.network.blockUser(formData);
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.modals.present(ChatBatsComponent);
      // this.nav.navigateTo('pages/chat-room');
    }
  }
}
