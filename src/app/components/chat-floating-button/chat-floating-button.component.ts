import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { UserDetailComponentComponent } from 'src/app/pages/dating/user-detail-component/user-detail-component.component';
import { NavService } from 'src/app/services/basic/nav.service';
import { ChatBatsComponent } from '../chat-bats/chat-bats.component';

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

  constructor(injector: Injector, public nav: NavService) {
    super(injector);
    ChatFloatingButtonComponent.instances.push(this);

    this.events.subscribe('OPEN_CHAT_BAR', () => {
      console.log('FIRING_EVENT');
      setTimeout(() => {
        this.activated = true;
      }, 500);
    });
  }

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
  }

  openSocialChatRoom() {
    this.nav.navigateTo('pages/chat-room');
  }

  openDatingChatRoom() {
    this.nav.navigateTo('pages/dating');
  }

  async checkIfDating() {
    let res = await this.network.getUser();

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
    let res = await this.network.getUser();

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
    this.nav.push('pages/chat-rooms');
  }

  fabClicked() {
    if (!this.isDatingUser) this.editUser();
  }

  showChatBar(data) {
    this.modals.present(ChatBatsComponent, data);
  }
}
