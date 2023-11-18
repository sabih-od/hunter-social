import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventsService } from './basic/events.service';
import { NavService } from './basic/nav.service';
import { DataService } from './data.service';
import { UtilityService } from './utility.service';
import { Config } from '../../app/config/main.config';
import { Capacitor, Plugins } from '@capacitor/core';
import { ActionPerformed } from '@capacitor/push-notifications';
const { LocalNotifications } = Plugins;
declare const Pusher: any;
@Injectable({
  providedIn: 'root',
})
export class PusherService {
  channel;
  gChannel;
  userId;
  constructor(
    public http: HttpClient,
    private utility: UtilityService,
    public dataService: DataService,
    public nav: NavService,
    public eventService: EventsService
  ) { }

  public init(channel_id, token) {
    var pusher = new Pusher('b17eef1edf2329b7f6e5', {
      cluster: 'mt1',
      authEndpoint: Config.SERVICEURL + '/broadcasting/auth',
      auth: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    this.channel = pusher.subscribe('private-channel-' + channel_id);
  }

  public getChannel() {
    return this.channel;
  }

  public getGchannel() {
    return this.gChannel;
  }

  globalChatNotify(token, userId) {
    this.userId = userId;
    return new Promise((resolve) => {
      var pusher = new Pusher('b17eef1edf2329b7f6e5', {
        cluster: 'mt1',
        authEndpoint: Config.SERVICEURL + '/broadcasting/auth',
        auth: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      this.gChannel = pusher.subscribe(`private-user-${userId}`);
      console.log('harvey');
      this.gChannel.bind('chatNotify', async (e) => {
        console.log('Event Recieved', e);
        this.dataService.dataId = e.sender_id;
        console.log('MEYOUUSER', e.sender_id, this.userId);
        if (!this.nav.router.url.includes('pages/chat-room')) {
          let url = window.location.href;

          if (e.sender_id != this.userId) {
            // this.utility.presentSuccessToast(
            //   e.content ?? 'You have received a new message'
            // );
            //   const flag = await this.utility.presentConfirm(
            //     'Go To Chats',
            //     'Ignore',
            //     'Message Received',
            //     'You Have a New Message'
            //   );
            //   if (flag) {
            //     this.nav.push('pages/chat-room');
            //   }
          }
        } else {
          this.eventService.publish('UPDATE_CHATS');
        }
      });

      this.gChannel.bind('userNotification', async (e) => {
        // this is used for user friend request notification

        console.log('USER NOTIFICATION', e);
        let notifications_count = JSON.parse(localStorage.getItem('notifications_count'))
        notifications_count = parseInt(notifications_count);
        localStorage.setItem('notifications_count', notifications_count + 1)
        var event = new Event('storageChange');
        window.dispatchEvent(event);

        // if (Capacitor.getPlatform() !== 'web') {
        //   const notifs = await LocalNotifications.schedule({
        //     notifications: [
        //       {
        //         title: 'Hunter Social',
        //         body: e.message ?? 'You have received a new notification',
        //         id: 1,
        //         schedule: { at: new Date(Date.now() + 1000) },
        //         sound: null,
        //         attachments: null,
        //         actionTypeId: '',
        //         extra: null,
        //         actions: [
        //           {
        //             id: 'ignore',
        //             title: 'Ignore',
        //             requiresAuthentication: false,
        //             foreground: true,
        //           },
        //           {
        //             id: 'accept',
        //             title: 'Accept',
        //             requiresAuthentication: false,
        //             foreground: true,
        //           },
        //         ],
        //       },
        //     ],
        //   });
        // } else {
        //   this.utility.presentSuccessToast(
        //     e.message ?? 'You have received a new notification'
        //   );
        // }



      });

      if (Capacitor.getPlatform() !== 'web') {
        LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction: ActionPerformed) => {
          console.log('notificationAction', notificationAction);
          if (notificationAction.actionId == 'tap') {
            this.nav.push('pages/notifications')
          }
        });
      }

      resolve(true);
    });
  }
}
