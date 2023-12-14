import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { UserDetailComponentComponent } from 'src/app/pages/dating/user-detail-component/user-detail-component.component';
import { NavService } from 'src/app/services/basic/nav.service';
import { ChatBatsComponent } from '../chat-bats/chat-bats.component';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'chat-floating-button',
  templateUrl: './chat-floating-button.component.html',
  styleUrls: ['./chat-floating-button.component.scss'],
})
export class ChatFloatingButtonComponent extends BasePage implements OnInit {
  @Input() horizontal = 'end';
  isDatingUser = false;
  activated = false;
  static instances = [];

  constructor(injector: Injector, public nav: NavService, public badge: Badge) {
    super(injector);
    ChatFloatingButtonComponent.instances.push(this);

    this.events.subscribe('OPEN_CHAT_BAR', () => {
      console.log('FIRING_EVENT');
      setTimeout(() => {
        this.activated = true;
      }, 500);
    });
  }

  message_count = 0;

  ngOnInit() {
    this.checkIfDating();
    this.events.subscribe('DATING_PROFILE_CREATED', () => {
      ChatFloatingButtonComponent.instances.forEach((element) => {
        element.isDatingUser = true;
      });
    });
    this.events.subscribe('SHOW_GROUPS', () => {
      this.showChatBar({ showGroup: true });
    });

    this.events.subscribe('UPDATE_CHANNELS', this.newMessage.bind(this));

    this.dataService.messages_count.subscribe(data => {
      console.log('this.dataService.messages_count data => ', data)
      this.message_count = data;
    })
    // const messagescount = localStorage.getItem('messages_count');
    // this.message_count = Number(messagescount);

  }

  newMessage(data) {
    console.log('chat floating button new message recieved', data);
  }

  openSocialChatRoom() {
    localStorage.setItem('messages_count', '0');
    this.nav.navigateTo('pages/chat-room');
  }

  openDatingChatRoom() {
    localStorage.setItem('messages_count', '0');
    this.nav.navigateTo('pages/dating');
  }

  async checkIfDating() {
    // console.log('checkIfDating => this.network.getUser() => ')
    let res = await this.users.getUser();

    if (
      res &&
      res.data &&
      res.data.user?.profile_detail &&
      !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
      res.data.user?.profile_detail.is_dating_profile
    ) {
      this.isDatingUser = true;
    } else {
      this.isDatingUser = false;
    }
  }

  async checkUser() {
    console.log('checkUser => this.network.getUser() => ')
    let res = await this.users.getUser();

    if (
      res &&
      res.data &&
      res.data.user?.profile_detail &&
      !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
      res.data.user?.profile_detail.is_dating_profile
    ) {
      this.isDatingUser = true;
      this.openDatingChatRoom();
    } else {
      this.isDatingUser = false;
      this.editUser();
    }
  }

  async editUser() {
    let data = await this.modals.present(UserDetailComponentComponent);
    console.log(data);
    if (data.data?.success) this.openDatingChatRoom();
  }

  groupChat() {
    localStorage.setItem('messages_count', '0');
    this.nav.push('pages/chat-rooms');
  }

  fabClicked() {
    if (!this.isDatingUser) this.editUser();
  }

  async showChatBar(data) {
    if (this.platform.is('cordova')) {
      const badgecount = await this.badge.get();
      const count = localStorage.getItem('messages_count');
      console.log('badgecount => ', badgecount);
      if (badgecount != 0 && Number(count) < badgecount) {
        this.badge.set(Number(badgecount) - Number(count))
      }
    }

    localStorage.setItem('messages_count', '0');
    this.dataService.updateMessageCount(0);
    // this.modals.present(ChatBatsComponent, data);
    this.nav.push('pages/conversations')
  }
}
