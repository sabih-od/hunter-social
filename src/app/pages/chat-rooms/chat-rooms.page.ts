import { Component, Injector, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { PeoplesComponent } from 'src/app/components/peoples/peoples.component';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-rooms.page.html',
  styleUrls: ['./chat-rooms.page.scss'],
})
export class ChatRoomsPage extends BasePage implements OnInit, ViewWillEnter {
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
  isLoading = false;
  search = '';

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
    // this.isLoading = true;
    // this.dataService.chat_data = {};
    // this.nav.push('pages/chat');
    this.events.publish('OPEN_CHAT_BAR');
    await this.getGroups();
    // this.isLoading = false;
    this.events.subscribe('UPDATE_GROUPS', this.getGroups.bind(this));
  }

  async getGroups() {
    let user = await this.users.getUser();
    console.log('User_ID', user.id);

    let res = await this.network.getGroups();
    console.log('getGroups', res);
    if (res && res.data) {
      this.groups = res.data.data?.map((group) => ({
        ...group,
        canJoin:
          Object.values(group.channel.participants).indexOf(user.id) === -1 ??
          true,
      }));
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async addNew() {
    let res = await this.modals.present(PeoplesComponent);
    this.getGroups();
  }

  async doRefresh($event) {
    // this.isLoading = true;
    await this.getGroups();
    $event.target.complete();
    //this.isLoading = false;
  }

  viewGroup(item) {
    if (!item.canJoin) {
      // Iser is already joined move to chat page
      this.dataService.chat_data = { ...item, isGroup: true };
      this.nav.push('pages/chat');
    }
  }
}
