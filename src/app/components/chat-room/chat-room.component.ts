import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { PeoplesComponent } from '../peoples/peoples.component';
import { BroadcastMessagePage } from 'src/app/pages/broadcast-message/broadcast-message.page';
import { PusherService } from 'src/app/services/pusher-service.service';
import _ from 'lodash';

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
  page = 1;
  isAdminNewMsg = false;
  constructor(injector: Injector, private pusher: PusherService) {
    super(injector);
  }
  next_page_url = null;

  ionViewWillEnter() {
    //this.initialize();
  }

  async ngOnInit() {
    this.initialize();
    // this.initPusher();
  }

  async initialize() {
    this.loading = true;
    this.dataService.chat_data = {};
    // this.nav.push('pages/chat');
    await this.getFriends();
    this.loading = false;
    this.events.subscribe('UPDATE_CHATS', this.getFriends.bind(this));
    this.events.subscribe('UPDATE_CHANNELS', this.newMessage.bind(this));

  }

  async initPusher() {
    let token = localStorage.getItem('token');
    const user = await this.users.getUser();
    console.log('user => ', user.id)
    this.pusher.globalChatNotify(token, user.id);
  }
  newMessage(data) {
    console.log('newMessage data => ', data)
    // this.users.getNotificationCount()
    if (data.sender_id) {
      const list = this.friends.map(x => {
        if (x.id == data.sender_id) {
          // x.hasUnread = true;
          x.notifications = x.notifications + 1
        }
        return x;
      })

      console.log('list => ', list)
      // const index = _.findIndex(list, { 'sender_id': data.sender_id });
      const index = list.findIndex(x => x.id == data.sender_id);
      console.log('index => ', index)
      if (index !== -1) {
        const movedObject = list.splice(index, 1)[0];
        list.unshift(movedObject);
      }
      console.log('list => ', list)

      this.friends = list;
    }
  }

  onSearch(clear) {
    if (clear) this.search = '';
    else this.search = this._search;
  }

  async getFriends() {
    this.sender_id = this.dataService.dataId;
    let res = await this.network.getFriends(this.page);
    let self = this;
    console.log('getFriends', res);
    if (res && res.data) {
      if (res.data.next_page_url) this.next_page_url = res.data.next_page_url;
      const friendslist = res.data.data.map((user) => ({
        ...user,
        hasUnread: self.sender_id === user.id,
        profile_image: self.image.getImageUrl(user.profile_image),
      }));

      this.friends = this.page != 1 ? [...this.friends, ...friendslist] : friendslist;
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
    this.page = 1;
    await this.getFriends();
    $event.target.complete();
    this.refreshing = false;
  }

  showBroadcastMessage() {
    this.modals.present(BroadcastMessagePage);
  }

  loadmorefriends(ev) {
    if (this.next_page_url != null) {
      this.page = this.page + 1;
      this.getFriends();
      setTimeout(() => {
        ev.target.complete();
        // (ev as IonInfiniteScrollContent).target.complete();
      }, 500);
    } else {
      ev.target.complete();
    }
  }
}
