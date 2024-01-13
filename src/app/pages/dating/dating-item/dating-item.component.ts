import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'dating-item',
  templateUrl: './dating-item.component.html',
  styleUrls: ['./dating-item.component.scss'],
})
export class DatingItemComponent extends BasePage implements OnInit {
  @Input() item: any;
  @Input() index: any;

  @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
  loading = false;

  constructor(injector: Injector) {
    super(injector);
    this.index = this.index ? this.index : 1;
  }

  ngOnInit() {
    console.log("this.item.profile_image.includes('ph-avatar.png') => ", this.item.profile_image.includes('ph-avatar.png'))
    if (this.item.profile_image.includes('ph-avatar.png')) { this.item.profile_image = '/assets/Images/dummy-profile.jpg' }
  }


  openPopup($event) {
    console.log(this.item);
    this.alert.presentPopoverReportingComponent($event, {
      item_id: this.item.id,
      item_desc: this.item.content,
      tag: 'User',
    });
  }

  async unfriend() {
    this.loading = true;
    let res = await this.network.unfriend(this.item.id);
    console.log('unfriend', res);
    if (res && res.data) {
      // this.utility.presentSuccessToast(res.message);
      // this.update.emit({ update: true });

      let user = await this.users.getUser()
      user.connection_count = user.connection_count - 1;
      this.users.setUser(user)

      this.events.publish('UPDATE_CHATS', { ...res.data, type: 'unfriend' });
      this.events.publish('DATING_UPDATED', { addressee_id: this.item.id, type: 'unfriend' });
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    this.loading = false;
  }

  async acceptRequest() {
    this.loading = true;
    let res = await this.network.acceptRequest(this.item.id);
    console.log('acceptRequest', res);
    if (res && res.data) {
      // this.utility.presentSuccessToast(res.message);
      this.events.publish('DATING_UPDATED', { addressee_id: this.item.id, type: 'acceptRequest' });
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    this.loading = false;
  }

  async cancelRequest() {
    this.loading = true;
    let res = await this.network.cancelRequest(this.item.id);
    console.log('cancelRequest', res);
    if (res && res.data) {
      // this.utility.presentSuccessToast(res.message);
      // this.update.emit({ update: true });
      // this.events.publish('UPDATE_CHATS', { ...res.data, type: 'cancelRequest' });
      this.events.publish('DATING_UPDATED', { addressee_id: this.item.id, type: 'cancelRequest' });
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    this.loading = false;
  }

  async addFriend() {
    this.loading = true;
    if (this.item.is_sent_friend_request) {
      this.loading = false;
      return this.utility.presentToast('Friend Request Already Sent');
    }
    console.log('add Friend')
    let res = await this.network.addFriend(this.item.id);
    console.log('addFriend', res);

    if (res && res.data) {
      // this.utility.presentSuccessToast('Success');
      this.events.publish('DATING_UPDATED', { ...res.data, type: 'addfriend' });
    } else
      this.utility.presentToast(
        res?.error?.errors?.userId ?? 'Something went wrong'
      );

    this.loading = false;
  }

  async unblockFriend() {
    let res = await this.network.unblockFriend(this.item.id);
    console.log('unblockFriend', res);
    this.update.emit({ update: true });
  }

  async goToProfile() {
    console.log('ITEM', this.item);
    let isOpen = await this.modals.isModalOpen();
    if (isOpen) this.modals.dismiss({ date: 'A' });
    this.nav.navigateTo('pages/profile', {
      queryParams: { user_id: this.item.id },
    });
  }
}
