import { Component, Injector, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BasePage } from '../../base-page/base-page';
import { MenuNotFriendComponent } from '../menu-not-friend/menu-not-friend.component';
import { MenuComponent } from '../menu/menu.component';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'chat-row',
  templateUrl: './chat-row.component.html',
  styleUrls: ['./chat-row.component.scss'],
})
export class ChatRowComponent extends BasePage implements OnInit {
  @Input() item;
  constructor(injector: Injector, public popoverController: PopoverController, public badge: Badge) {
    super(injector);
  }

  ngOnInit() {

  }

  async showMenu($event) {
    let menu = await this.popoverController.create({
      component: this.item.is_friend ? MenuComponent : MenuNotFriendComponent,
      event: $event,
      componentProps: { key1: this.item, item: this.item },
    });
    menu.present();
    let data = await menu.onDidDismiss();
    if (!data || !data.data) return;
    switch (data.data.type) {
      case 'unfriend':
        this.unfriend();
        break;

      case 'block':
        this.block();
        break;

      case 'accept':
        this.acceptRequest();
        break;

      case 'ignore':
        this.ignoreRequest();
        break;
    }

    //   let res = await this.modals.present(PostAdventureContentPage, {
    //     item: this.item,
    //   });

    //   if (res && res.data.refresh) this.events.publish('UPDATE_POSTS');
    // }
  }

  async acceptRequest() {
    let res = await this.network.acceptRequest(this.item.id);
    if (res && res.data) {

      let user = await this.users.getUser()
      user.connection_count = user.connection_count + 1;
      this.users.setUser(user)

      this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async ignoreRequest() {
    let res = await this.network.ignoreRequest(this.item.id);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async unfriend() {
    let res = await this.network.unfriend(this.item.id);
    if (res && res.data) {
      let user = await this.users.getUser()
      user.connection_count = user.connection_count - 1;
      this.users.setUser(user)

      this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async viewChat(item) {
    this.dataService.chat_data = item;
    let isOpen = await this.modals.isModalOpen();
    if (isOpen) this.modals.dismiss({ date: 'A' });
    item.notifications = 0;
    // this.badge.decrease(item?.notifications)
    this.nav.push('pages/chat');
  }



  async block() {
    let res = await this.network.block(this.item.id);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  goToProfile() {
    this.nav.navigateTo('pages/profile', {
      queryParams: { user_id: this.item.id },
    });
  }
}
