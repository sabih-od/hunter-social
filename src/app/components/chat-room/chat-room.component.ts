import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { PeoplesComponent } from '../peoples/peoples.component';

@Component({
  selector: 'chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent extends BasePage implements OnInit {
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
  loading = false;
  refreshing = false;
  search = '';
  sender_id = undefined;
  _search = '';
  constructor(injector: Injector) {
    super(injector);
  }

  ionViewWillEnter() {
    //this.initialize();
  }

  async ngOnInit() {
    this.initialize();
  }

  async initialize() {
    this.loading = true;
    this.dataService.chat_data = {};
    // this.nav.push('pages/chat');
    await this.getFriends();
    this.loading = false;
    this.events.subscribe('UPDATE_CHATS', this.getFriends.bind(this));
  }

  onSearch(clear) {
    if (clear) this.search = '';
    else this.search = this._search;
  }

  async getFriends() {
    this.sender_id = this.dataService.dataId;
    let res = await this.network.getFriends();
    let self = this;
    console.log('getFriends', res);
    if (res && res.data) {
      this.friends = res.data.map((user) => ({
        ...user,
        hasUnread: self.sender_id === user.id,
        profile_image: self.image.getImageUrl(user.profile_image),
      }));

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
    this.refreshing = true;
    await this.getFriends();
    $event.target.complete();
    this.refreshing = false;
  }
}
