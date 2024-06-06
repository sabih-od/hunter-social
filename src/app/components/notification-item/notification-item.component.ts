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
  @Output() notificationClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (this.item.cm_name && !this.item.content.includes('sent message')) {
      this.item.content = `${this.item.cm_name} sent message "${this.item.content}"`;
    }
    else if (this.item.admin_user_name && !this.item.admin_user_name.includes('New message')) {
      this.item.content = `New message from Admin "${this.item.content}"`;
      this.item.profile_image = '/assets/Images/ov-logo.png'
    }

  }

  clickItem(notiItem) {
    if (notiItem?.is_read == 0) {
      this.item.is_read = 1;
      // this.notificationClicked.emit(notiItem?.id)
      this.notificationClicked.emit(notiItem)
    }
  }

  acceptRequest(userid, id) {
    this.acceptClicked.emit({ userid, id });
  }

  ignoreRequest(userid, id) {
    this.ignoreClicked.emit({ userid, id });
  }

}
