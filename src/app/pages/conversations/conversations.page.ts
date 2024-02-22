import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { PusherService } from 'src/app/services/pusher-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage extends BasePage implements OnInit {

  // constructor() { }

  // ngOnInit() {
  // }


  ionViewWillEnter() {
    console.log('enter in view')
  }

  adminNotiCount = 0;
  friendNotiCount = 0;
  groupNotiCount = 0;

  constructor(injector: Injector, pusher: PusherService,
    private route: ActivatedRoute, private router: Router
  ) {
    super(injector);
  }
  tab = '';
  _showGroup;

  @Input() set showGroup(val) {
    this.tab = 'groups';
  }

  ngOnInit() {
    console.log('tab => ', this.tab);
    this.getNotificationsObject()

    this.route.queryParams.subscribe((params) => {
      // Get the value of the query parameter
      console.log('params => ', params)
      if (Object.keys(params).length > 0) {
        if (params['type'] == 'groups') { this.tab = 'groups' }
        if (params['type'] == 'individual') { this.tab = 'friends' }
        if (params['type'] == 'admin') { this.tab = 'admin' }
        if (params['type'] == 'people') { this.tab = 'people' }
        // this.activeSegment = params['type'] || 'defaultSegmentValue'; // Set a default value if needed
      } else {
        this.tab = 'friends';
      }
      console.log('tab => ', this.tab);
    });

  }

  async getNotificationsObject() {

    this.dataService.notification_and_message_count.subscribe(data => {
      console.log('conversation this.dataService.notification_and_message_count data => ', data)
      this.adminNotiCount = data?.admin;
      this.friendNotiCount = data?.friend;
      this.groupNotiCount = data?.group;
    })
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
    }
    else if ($event.target.value == 'chatbot') {
      $event.target.value = this.tab;
      const obj = {
        "id": "chatbot",
        // "email": "johnmartin@mailinator.com",
        "name": "Uncle Buck",
        // "created_at": "2023-01-20T17:40:57.000000Z",
        "profile_image": "https://hunterssocial.com/assets/images/udpate-logo.png",
        "hasUnread": false,
        "is_chatbot": true,
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
