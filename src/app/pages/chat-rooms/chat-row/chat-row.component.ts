import { Component, Injector, Input, OnInit } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { BasePage } from '../../base-page/base-page';
import { MenuNotFriendComponent } from '../menu-not-friend/menu-not-friend.component';
import { MenuComponent } from '../menu/menu.component';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'chat-row2',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss'],
})
export class ChatRowComponent extends BasePage implements OnInit {
  @Input() item;
  constructor(injector: Injector, public popoverController: PopoverController, public badge: Badge, public platform: Platform) {
    super(injector);
  }

  ngOnInit() { }

  async joinChatRoom() {
    let res = await this.network.joinChatRoom({
      channel_id: this.item.channel_id,
    });
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_GROUPS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  joinOrLeave() {
    if (this.item.canJoin) this.joinChatRoom();
    else this.leave();
  }

  async leave() {
    let isLeave = await this.utility.presentConfirm(
      'Yes',
      'No',
      'Confirm',
      'Are you sure want to leave this group?'
    );
    if (isLeave) {
      let res = await this.network.leaveGroup(this.item.channel_id);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.events.publish('UPDATE_GROUPS');
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }

  async viewGroup(item) {
    if (!item.canJoin) {
      // Iser is already joined move to chat page
      this.dataService.chat_data = { ...item, isGroup: true };
      let isOpen = await this.modals.isModalOpen();
      if (isOpen) this.modals.dismiss({ date: 'A' });
      item.notifications = 0;
      this.nav.push('pages/chat');
    }
  }


  async showMenu($event) {
    let menu = await this.popoverController.create({
      component: MenuComponent,
      event: $event,
      componentProps: { canJoin: this.item.canJoin },
    });
    menu.present();
    let data = await menu.onDidDismiss();
    if (!data || !data.data) return;
    switch (data.data.type) {
      case 'leave':
        this.leave();
        break;

      case 'join':
        this.joinChatRoom();
        break;
    }

    //   case 'block':
    //     this.block();
    //     break;

    //   case 'accept':
    //     this.acceptRequest();
    //     break;

    //   case 'ignore':
    //     this.ignoreRequest();
    //     break;
    // }

    //   let res = await this.modals.present(PostAdventureContentPage, {
    //     item: this.item,
    //   });
    //   if (res && res.data.refresh) this.events.publish('UPDATE_POSTS');
    // }
  }
}
