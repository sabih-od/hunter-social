import { Component, Injector, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { MenuComponent } from 'src/app/pages/chat-room/menu/menu.component';

@Component({
  selector: 'people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent extends BasePage implements OnInit {
  @Input() item;
  constructor(injector: Injector, public popoverController: PopoverController) {
    super(injector);
  }

  ngOnInit() { }

  async showMenu($event) {
    let menu = await this.popoverController.create({
      component: MenuComponent,
      event: $event,
    });
    menu.present();
    let data = await menu.onDidDismiss();
    console.log(data);
    if (data.data?.type === 'unfriend') this.unfriend();
    else if (data.data?.type === 'block') this.block();
    //   let res = await this.modals.present(PostAdventureContentPage, {
    //     item: this.item,
    //   });
    //   console.log(res);
    //   if (res && res.data.refresh) this.events.publish('UPDATE_POSTS');
    // }
  }

  async unfriend() {
    let res = await this.network.unfriend(this.item.id);
    console.log('unfriend', res);
    if (res && res.data) {

      let user = await this.users.getUser()
      user.connection_count = user.connection_count - 1;
      this.users.setUser(user)

      this.utility.presentSuccessToast(res.message);
      this.events.publish('PEOPLE_UPDATED');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  viewChat() {
    this.modals.dismiss({ data: 'A' });
    this.dataService.chat_data = this.item;
    this.nav.push('pages/chat', this.item);
  }

  async block() {
    let res = await this.network.block(this.item.id);
    console.log('unfriend', res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('PEOPLE_UPDATED');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async unblock() {
    let res = await this.network.unblock(this.item.id);
    console.log('unfriend', res);
    if (res && res.data) {

      let user = await this.users.getUser()
      user.connection_count = user.connection_count - 1;
      this.users.setUser(user)

      this.utility.presentSuccessToast(res.message);
      this.events.publish('PEOPLE_UPDATED');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async addFriend() {
    let res = await this.network.addFriend(this.item.id);
    console.log('addFriend', res);
    if (res && res.data) {

      let user = await this.users.getUser()
      user.connection_count = user.connection_count + 1;
      this.users.setUser(user)

      this.item.canRequest = false;
      this.item.is_sent_friend_request = true;
      // this.utility.presentSuccessToast(res.message);
      this.events.publish('UPDATE_CHATS');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }
}
