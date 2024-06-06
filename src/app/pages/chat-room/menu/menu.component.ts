import { Component, Injector, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { BasePage } from '../../base-page/base-page';
import { ReportPage } from '../../report/report.page';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends BasePage implements OnInit {
  // @Input() user_profile: any;
  @Input() item: any;
  constructor(
    public popoverController: PopoverController,
    injector: Injector,
    public navParams: NavParams
  ) {
    super(injector);
    this.item = this.navParams.get('key1');
  }

  ngOnInit() {}

  action(type) {
    this.popoverController.dismiss({ type });
  }
  async openreport() {

    if (this.item.is_reported) {
      this.alert.presentFailureToast('Already reported!');
    } else {
      var res = await this.modals.present(ReportPage, {
        tag: 'user',
        item_id: this.item.id,
        item_desc: '',
        item: this.item,
      });
    }
  }
}
