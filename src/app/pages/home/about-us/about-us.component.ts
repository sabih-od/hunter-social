import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent extends BasePage implements OnInit {
  user: any = {};
  packageId = 0;
  data;
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    // let res = await this.users.getUser();
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.about_us;
    // this.packageId = res?.data?.user?.profile_detail?.package_id;
  }

  navigate(url) {
    // if (url === 'post1') this.nav.push('pages/post-adventure');
    // return
    if (this.packageId != 1) {
      this.goto('pages/post-adventure');
    } else {
      this.utility.presentFailureToast(
        'You are not allowed to view this page. Please upgrade your account.'
      );
    }
  }
  goto(url) {
    if (this.menuCtrl.isOpen) this.menuCtrl.toggle();
    this.nav.push(url);
  }
}
