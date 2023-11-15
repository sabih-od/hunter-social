import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent implements OnInit {

  @Input() item: any;
  @Output() acceptClicked = new EventEmitter();
  @Output() ignoreClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {

    console.log('item => ', this.item)

  }

  acceptRequest(userid, id) {
    this.acceptClicked.emit({ userid, id });
  }

  ignoreRequest(userid, id) {
    this.ignoreClicked.emit({ userid, id });
  }

  // async acceptRequest(userid, id) {
  //   // let res = await this.network.acceptRequest(userid);
  //   // console.log('acceptRequest', res);
  //   // if (res && res.data) {
  //   //   // this.utility.presentSuccessToast(res.message);
  //   //   const index = this.notifications.findIndex(x => x.id == id)
  //   //   this.notifications[index].notificationable.user.is_friend_requested = false;
  //   //   this.notifications[index].notificationable.user.is_friend = true;
  //   //   this.events.publish('UPDATE_CHATS');
  //   // } else
  //   //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  // }

  // async ignoreRequest(userid, id) {
  //   // let res = await this.network.ignoreRequest(userid);
  //   // console.log('ignoreRequest', res);
  //   // if (res && res.data) {
  //   //   this.notifications = this.notifications.filter(x => x.id != id)
  //   //   // this.utility.presentSuccessToast(res.message);
  //   //   this.events.publish('UPDATE_CHATS');
  //   // } else
  //   //   this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  // }


}
