import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonTabs, ViewWillEnter } from '@ionic/angular';
import { PromotionsComponent } from 'src/app/components/promotions/promotions.component';
import { BasePage } from '../base-page/base-page';
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;
import { PusherService } from 'src/app/services/pusher-service.service';
import { UserDetailComponentComponent } from '../dating/user-detail-component/user-detail-component.component';
import { Config } from 'src/app/config/main.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePage implements OnInit {
  guideLocators = [
    {
      image: 'assets/images/home1.png',
    },
    {
      image: 'assets/images/hbt4.png',
    },
    {
      image: 'assets/images/home3.png',
    },
    {
      image: 'assets/images/home3.png',
    },
    {
      image: 'assets/images/home3.png',
    },
    {
      image: 'assets/images/home3.png',
    },
  ];

  adventures = [
    {
      image: 'assets/images/home-row-1.png',
    },
    {
      image: 'assets/images/home-row-12.png',
    },
    {
      image: 'assets/images/home-row-1.png',
    },
  ];

  datings;
  items = [];

  showmodal = true;

  laws = [
    {
      image: 'assets/images/hunt.png',
      title: 'States Directory Regarding',
      description: 'Lorem Ipsum',
    },
    {
      image: 'assets/images/fish_hunt.png',
      title: 'States Directory Regarding',
      description: 'Lorem Ipsum',
    },
  ];
  dashboardData;
  user: any = [];
  packageId: 0;
  isLoading = false;

  constructor(
    injector: Injector,
    private iab: InAppBrowser,
    private pusher: PusherService
  ) {
    super(injector);
    this.callPusherService();
  }

  async ngOnInit() {
    // const notifs = await LocalNotifications.schedule({
    //   notifications: [
    //     {
    //       title: 'Title',
    //       body: 'Body',
    //       id: 1,
    //       schedule: { at: new Date(Date.now() + 1000) },
    //       sound: null,
    //       attachments: null,
    //       actionTypeId: '',
    //       extra: null,
    //       actions: [
    //         {
    //           id: 'ignore',
    //           title: 'Ignore',
    //           requiresAuthentication: false,
    //           foreground: true,
    //         },
    //         {
    //           id: 'accept',
    //           title: 'Accept',
    //           requiresAuthentication: false,
    //           foreground: true,
    //         },
    //       ],
    //     },
    //   ],
    // });
    // console.log('scheduled notifications', notifs);
    //  this.initialize();
    //this.modals.present(UserDetailComponentComponent);
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

  async initialize() {
    this.datings = this.dataService.getDatings();
    this.packageId = await this.user.profile_detail.package_id;

    console.log(localStorage.getItem('token'));
    this.dashboardData = this.dataService.getDashboardData();
    console.log(this.dashboardData);

    let res = await this.network.getUser();
    console.log(res);
    if (res && res.data && res.data.user) {
      this.users.setUser(res.data.user);
      this.events.publish('USER_DATA_RECEIVED', res.data.user);

      // get post data
      this.getData();
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
      this.nav.push('pages/login');
    }
  }

  async getData() {
    let res = await this.network.getPosts();

    console.log('response', res);
    if (res && res.data) {
      this.items = res.data.map((item) => {
        if (Array.isArray(item.media_upload)) {
          item.image = item.media_upload[0]
            ? item.media_upload[0].url
            : 'assets/images/adventure-3.png';
        } else {
          item.image = item.media_upload
            ? item.media_upload.url
            : 'assets/images/adventure-3.png';
        }

        return item;
      });
    }
  }

  openPostAdventure() {
    this.nav.push('pages/post-adventure');
  }

  openDatingAdventure() {
    this.nav.push('pages/dating');
  }

  setCurrentTab() {
    // HomePage.selectedTab = this.tabs.getSelected();
  }

  ionViewDidEnter() { }

  openWebview() {
    const browser = this.iab.create(Config.URL + '/public/', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }

  hideModal() {
    this.showmodal = false;
  }

  async doRefresh($event) {
    this.isLoading = true;
    await this.getData();
    $event.target.complete();
    this.isLoading = false;
  }
}
