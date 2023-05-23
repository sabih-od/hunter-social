import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-hunters',
  templateUrl: './hunters.component.html',
  styleUrls: ['./hunters.component.scss'],
})
export class HuntersComponent extends BasePage implements OnInit {
  user: any = {};
  packageId = 0;
  data;
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    let dashboardData = this.dataService.getDashboardData();
    this.data = dashboardData.hunters;

    this.user = await this.users.getUser();
    this.packageId = this.user?.profile_detail?.package_id;
  }

  navigate(url) {
    // if (url === 'post1') this.nav.push('pages/post-adventure');
    this.packageId = this.user?.profile_detail?.package_id;
    console.log(url, this.packageId);

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
