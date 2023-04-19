import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  //
  lastPath;
  constructor(
    public location: Location,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public events: EventsService
  ) {
    this.router.onSameUrlNavigation = 'reload';
    router.events.subscribe((val) => {
      if (location.path() !== this.lastPath)
        this.events.publish('ROUTE_CHANGED');
      this.lastPath = location.path();
    });
  }

  async setRoot(page, param = {}) {
    // await this.nativePageTransitions.fade(null);
    const extras: NavigationExtras = {
      queryParams: param,
    };
    this.navigateTo(page, extras);
  }

  async push(page, param = {}) {
    // await this.nativePageTransitions.slide(this.options);
    const extras: NavigationExtras = {
      queryParams: param,
    };
    this.navigateTo(page, extras);
  }

  async pop() {
    return new Promise<void>(async (resolve) => {
      // await this.nativePageTransitions.slide(this.options);
      // await this.nativePageTransitions.fade(null);
      this.location.back();
      resolve();
    });
  }

  navigateTo(link, data?: NavigationExtras) {
    console.log(link);
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([link], data);
  }

  navigateToChild(link, data?: NavigationExtras) {
    data.relativeTo = this.activatedRoute;
    this.router.navigate([link], data);
  }

  getParams() {
    return this.activatedRoute.snapshot.params;
  }

  getQueryParams() {
    return this.activatedRoute.snapshot.queryParams;
  }
}
