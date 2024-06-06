import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private androidPermissions: AndroidPermissions) {}

  async requestPermission() {
    let res = await this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    ]);
  }

  checkStoragePermissions() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then(
        (result) => {
          if (!result.hasPermission) this.requestPermission();
        },
        (err) => this.requestPermission()
      );
  }
}
