import { Injectable } from '@angular/core';
// import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { NetworkService } from './network.service';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { EventsService } from './basic/events.service';
import { NavService } from './basic/nav.service';
import { DataService } from './data.service';
import { Badge } from '@ionic-native/badge/ngx';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    public events: EventsService,
    public network: NetworkService,
    public dataService: DataService,
    public nav: NavService,
    public badge: Badge) {
    this.assignEvents();
  }


  assignEvents() {
    this.events.subscribe(
      'user:settokentoserver',
      this.setTokenToServer.bind(this)
    );
  }

  async setTokenToServer() {
    const fcm_token = await this.getFCMToken();
    console.log('setTokenToServer fcm_token => ', fcm_token)
    if (fcm_token) {
      this.network.saveFcmToken({ token: fcm_token }).then(
        (dats) => { },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  async setupFMC() {
    console.log('setupFMC => ')
    if (Capacitor.getPlatform() !== 'web') {
      console.log('this.setupNativePush => ',)
      await this.setupNativePush();
    }

    //   this.fcm.subscribeToTopic('all');
    //   this.fcm.onNotification().subscribe(data => {
    //     if (!data.wasTapped) {
    //       this.audio.play("");
    //       if (data['showalert'] != null) {
    //         this.events.publish('user:shownotificationalert', data);
    //       } else {
    //         this.events.publish('user:shownotification', data);
    //       }
    //     };
    //   })
    //   this.fcm.onTokenRefresh().subscribe(token => {
    //     this.sqlite.setFcmToken(token);
    //     this.events.publish('user:settokentoserver');
    //   });
  }

  setupNativePush() {
    return new Promise<void>((resolve) => {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          PushNotifications.register();
          resolve();
        } else {
          // Show some error
          resolve();
        }
      });

      console.log('setupNativePush a => ')
      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('registration FCM_TOKEN', token.value);
        localStorage.setItem('fcm_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('NOTIFICATION_RECEIVED', notification);
          const extradata = JSON.parse(notification.data.extra_data)
          console.log('extradata?.channel_id => ', extradata?.channel_id);
          console.log('this.dataService.channel_id => ', this.dataService.channel_id);

          if (extradata?.channel_id) {
            const messagescount = localStorage.getItem('messages_count');
            const countnew = String(Number(messagescount) + 1);
            localStorage.setItem('messages_count', countnew);
            this.dataService.updateMessageCount(countnew);
            this.updateBadge(countnew)
          }

          if (extradata?.channel_id != this.dataService.channel_id) {
            console.log('wokring');
            this.events.publish('dashboard:notificationReceived', notification);
            this.events.publish('dashboard:refreshpage', notification);
          }
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          console.log('pushNotificationActionPerformed', notification.notification);
          const extradata = JSON.parse(notification.notification.data.extra_data)
          if (extradata?.channel_id) {
            localStorage.setItem('messages_count', '0');
            this.dataService.updateMessageCount(0);
            this.nav.push('pages/conversations')
          } else {
            this.nav.push('pages/notifications')
          }
          // localStorage.setItem('notification', JSON.stringify(notification));
        }
      );

      //this.getDeliveredNotifications();

      resolve();
    });
  }


  async updateBadge(messagecount) {
    const badgecount = await this.badge.get();
    // if (badgecount != 0 && messagecount < badgecount) {
    this.badge.set(Number(badgecount) + Number(messagecount))
    // }
  }

  async getFCMToken() {
    return new Promise((resolve) => {
      const token = localStorage.getItem('fcm_token');
      console.log(token);
      if (token) {
        resolve(token);
        // this.sqlite.setFcmToken(token);
        // this.events.publish('user:settokentoserver');
      }

      resolve(null);

      // resolve(true);
      // this.fcm.getToken().then(v => resolve(v), (err) =>
      // { console.log(err); resolve(null) }).catch(v => { console.log(v); resolve(null) })
    });
  }

  // getDeliveredNotifications = async () => {
  //   const notificationList =
  //     await PushNotifications.getDeliveredNotifications();
  //   console.log('delivered notifications', notificationList);
  // };
}
