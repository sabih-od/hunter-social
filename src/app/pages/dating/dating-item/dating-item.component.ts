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

  @Output('update') update: EventEmitter<any> = new EventEmitter<any>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}


  openPopup($event) {
    console.log(this.item);
    this.alert.presentPopoverReportingComponent($event, {
      item_id: this.item.id,
      item_desc: this.item.content,
      tag: 'User',
    });
  }

  async addFriend() {
    if (this.item.is_sent_friend_request) {
      return this.utility.presentToast('Friend Request Already Sent');
    }

    let res = await this.network.addFriend(this.item.id);
    console.log('addFriend', res);

    if (res && res.data) {
      this.utility.presentSuccessToast('Success');
      this.events.publish('DATING_UPDATED');
    } else
      this.utility.presentToast(
        res?.error?.errors?.userId ?? 'Something went wrong'
      );
  }

  async unblockFriend() {
    let res = await this.network.unblockFriend(this.item.id);
    console.log('addFriend', res);
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
