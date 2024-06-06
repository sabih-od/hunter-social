import { Component, Injector, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { RequestAGroupComponent } from '../request-a-group/request-a-group.component';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss'],
})
export class ChatRoomsComponent
  extends BasePage
  implements OnInit, ViewWillEnter {
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
  groups;
  loading = false;
  refreshing = false
  search = '';
  _search = '';

  constructor(injector: Injector) {
    super(injector);
  }

  onSearch(clear) {
    if (clear) this.search = '';
    else this.search = this._search;
  }

  ionViewWillEnter() {    

    this.initialize();
  }

  async ngOnInit() {    
    this.initialize();
  }

  async initialize() {
    // this.loading = true;
    // this.dataService.chat_data = {};
    // this.nav.push('pages/chat');
    this.events.publish('OPEN_CHAT_BAR');
    this.loading = true;
    await this.getGroups();
    // this.loading = false;
    this.events.subscribe('UPDATE_GROUPS', this.getGroups.bind(this));
    this.events.subscribe('UPDATE_NEW_GROUPS', this.newMessage.bind(this));
  }

  newMessage(data) {    
    // this.users.getNotificationCount()
    if (data.channel_id) {
      const list = this.groups.map(x => {
        if (x.channel_id == data.channel_id) {
          // x.hasUnread = true;
          x.notifications = x.notifications + 1
        }
        return x;
      })
      
      // const index = _.findIndex(list, { 'sender_id': data.channel_id });
      const index = list.findIndex(x => x.channel_id == data.channel_id);      
      if (index !== -1) {
        const movedObject = list.splice(index, 1)[0];
        list.unshift(movedObject);
      }      

      this.groups = list;
    }
  }

  async getGroups() {
    let user = await this.users.getUser();    

    let res = await this.network.getGroups();    
    if (res && res.data) {
      this.groups = res.data.data?.map((group) => ({
        ...group,
        canJoin:
          Object.values(group.channel.participants).indexOf(user.id) === -1 ??
          true,
      }));
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    this.loading = false;
  }

  async doRefresh($event) {
    this.refreshing = true;
    await this.getGroups();
    $event.target.complete();
    this.refreshing = false;
  }

  viewGroup(item) {
    if (!item.canJoin) {
      // Iser is already joined move to chat page
      this.dataService.chat_data = { ...item, isGroup: true };
      this.nav.push('pages/chat');
    }
  }

  showGroupRequestModal() {
    this.modals.present(RequestAGroupComponent);
  }

}
