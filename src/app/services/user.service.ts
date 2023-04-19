import { Injectable } from '@angular/core';
import { ImageService } from './image.service';
import { NetworkService } from './network.service';
import { UtilityService } from './utility.service';
const users = require('src/app/data/users.json');
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = null;
  constructor(
    public image: ImageService,
    public network: NetworkService,
    public utility: UtilityService
  ) {}

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
      if (json && json !== '') {
        let obj = JSON.parse(json);
        //console.log('USER_OBJ', obj);
        if (obj.profile_image)
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
