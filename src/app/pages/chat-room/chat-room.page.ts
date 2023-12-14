import { Component, Injector, OnInit } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { PeoplesComponent } from 'src/app/components/peoples/peoples.component';
import { BasePage } from '../base-page/base-page';
import _ from 'lodash';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage extends BasePage implements OnInit, ViewWillEnter {
  chatList = [
    // {
    //   image: 'assets/images/riffle.png',
    //   count: 20,
    //   title: 'Sporint Rifles',
    //   created_by: 'John Smith',
    //   participants: 99,
    //   time: 12,
    // },
    // {
    //   image: 'assets/images/ar_rifle.png',
    //   count: 11,
    //   title: 'AR Style Rifless',
    //   created_by: 'John Doe',
    //   participants: 112,
    //   time: 57,
    // },
  ];
  friends;
  isLoading = false;
  search = '';
  sender_id = undefined;
  page = 1;

  constructor(injector: Injector) {
    super(injector);
  }

  ionViewWillEnter() {
    this.initialize();
  }

  async ngOnInit() {
    //this.initialize();
  }

  async initialize() {
    this.isLoading = true;
    this.dataService.chat_data = {};
    // this.nav.push('pages/chat');
    await this.getFriends();
    this.isLoading = false;
    this.events.subscribe('UPDATE_CHATS', this.getFriends.bind(this));
  }

  async getFriends() {
    this.sender_id = this.dataService.dataId;
    let res = await this.network.getFriends(this.page);
    let self = this;
    console.log('getFriends =>', res);
    if (res && res.data) {
      const friendslist = res.data.map((user) => ({
        ...user,
        hasUnread: self.sender_id === user.id,
        profile_image: self.image.getImageUrl(user.profile_image),
      }));


      this.friends = this.page != 1 ? [...this.friends, ...friendslist] : friendslist;

      // const sortedData = _.orderBy(this.friends, ['created_at'], ['asc']);
      // console.log('sortedData => ', sortedData);

      // this.friends = [
      //   {
      //     name: 'Atif Garam',
      //     is_friend: true,

      //   }
      // ]
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    this.dataService.dataId = null;
    console.log('Sender Id destroyed', this.sender_id);
  }

  async addNew() {
    let res = await this.modals.present(PeoplesComponent);
    this.getFriends();
  }

  async doRefresh($event) {
    this.isLoading = true;
    this.page = 1;
    await this.getFriends();
    $event.target.complete();
    this.isLoading = false;
  }
}
