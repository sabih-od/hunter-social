import { Injectable } from '@angular/core';
import { ImageService } from './image.service';
import { NetworkService } from './network.service';
import { UtilityService } from './utility.service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Platform } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';
const users = require('src/app/data/users.json');
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = null;
  userprofile: BehaviorSubject<any>;
  states: BehaviorSubject<any>;
  cities = [];
  interestsList = []
  constructor(
    public image: ImageService,
    public network: NetworkService,
    public utility: UtilityService,
    public dataService: DataService,
    public platform: Platform,
    public badge: Badge
  ) {
    this.userprofile = new BehaviorSubject(null);
    this.states = new BehaviorSubject(null);
  }

  updateUserProfile(data) {
    this.userprofile.next(data);
  }
  updateStates(data) {
    this.states.next(data);
  }

  login(formdata) {
    return new Promise((resolve) => {
      let record = users.find((x) => x.email == formdata['email']);
      if (record) {
        this.setToken(record['id']);
        this.user = record;
        resolve(record);
      } else {
        this.user = null;
        resolve(false);
      }
    });
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return new Promise<any>((res) => {
      let json = localStorage.getItem('user');
      // console.log('getUser() json => ', json)
      if (json && json !== '') {
        let obj = JSON.parse(json);
        //console.log('USER_OBJ', obj);
        if (obj.profile_image && !obj.profile_image.includes('storage/uploads'))
          obj.profile_image = this.image.getImageUrl(obj.profile_image);

        res(obj);
      } else res(null);
    });
  }

  removeUser() {
    localStorage.removeItem('user');
  }

  async getIsAuthenticated() {
    return new Promise<boolean>(async (resolve) => {
      let res = await this.network.getUser();
      console.log('getUserFromAPI', res);
      if (res && res.data && res.data.user) resolve(true);
      else resolve(false);
    });

    // this.user = this.dataService.getUser();
  }

  // getUser() {
  //   return new Promise(async (resolve) => {
  //     let token = await this.getToken();
  //     console.log(token);
  //     let record = users.find((x) => parseInt(x.id) == parseInt(token));
  //     if (record) {
  //       this.user = record;
  //       resolve(record);
  //     } else {
  //       this.user = null;
  //       resolve(false);
  //     }
  //   });
  // }

  async getNotificationCount() {
    const noticount = await this.network.getUnreadMessageAndNotificationCount();
    console.log('getUnreadMessageAndNotificationCount => ', noticount)
    this.dataService.updateUnreadMessageAndNotificationCount(noticount?.data);
    this.dataService.updateNotificationsCount(noticount?.data?.unread_count);
    
  }



  setToken(token) {
    return localStorage.setItem('token', token);
  }

  removeToken() {
    return localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async isSelf(userId) {
    let user = await this.getUser();
    return user.id === userId;
  }

  getProfileImage(profile_image) {
    return !this.utility.isNullOrEmpty(profile_image) &&
      !profile_image.includes('http')
      ? this.image.getImageUrl(profile_image)
      : !this.utility.isNullOrEmpty(profile_image)
        ? profile_image
        : this.image.getDefaultImg();
  }
}
