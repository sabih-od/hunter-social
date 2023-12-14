import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { PusherService } from 'src/app/services/pusher-service.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage extends BasePage implements OnInit {

  // constructor() { }

  // ngOnInit() {
  // }

  constructor(injector: Injector, pusher: PusherService) {
    super(injector);
  }

  tab = 'friends';
  _showGroup;

  @Input() set showGroup(val) {
    this.tab = 'groups';
  }

  ngOnInit() {
  }

  segmentChanged($event) {
    if ($event.target.value == 'admin') {
      $event.target.value = this.tab;
      const obj = {
        "id": "admin",
        // "email": "johnmartin@mailinator.com",
        "name": "Hunter Social",
        // "created_at": "2023-01-20T17:40:57.000000Z",
        "profile_image": "https://hunterssocial.com/assets/images/udpate-logo.png",
        "hasUnread": false,
        "is_admin": true,
      }
      this.dataService.chat_data = obj;
      this.nav.push('pages/chat');
    } else {
      this.tab = $event.target.value;
    }
  }

  close() {
    this.modals.dismiss();
  }

}
