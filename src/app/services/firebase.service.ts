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

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public events: EventsService, public network: NetworkService) {
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
    console.log('fcm_token => ', fcm_token)
    if (fcm_token) {
      this.network.saveFcmToken({ token: fcm_token }).then(
        (dats) => {},
        (err) => {
          console.error(err);
        }
      );
    }
  }

  async setupFMC() {
    if (Capacitor.getPlatform() !== 'web') {
      console.log('this.setupNativePush => ', )
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

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('FCM_TOKEN', token.value);

        localStorage.setItem('fcm_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('NOTIFICATION_RECEIVED', notification);

          this.events.publish('dashboard:notificationReceived', notification);
          this.events.publish('dashboard:refreshpage', notification);
        }
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          console.log(
            'pushNotificationActionPerformed',
            notification.notification.data
          );
          localStorage.setItem('notification', JSON.stringify(notification));
        }
      );

      //this.getDeliveredNotifications();

      resolve();
    });
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
