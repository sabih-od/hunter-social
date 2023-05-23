import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage extends BasePage implements OnInit {
  user_id: any;
  @Input() tag: any = '';
  @Input() item_id: any;
  @Input() item_desc: any;
  @Input() item: any;
  reason: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  async submit() {
    console.log(this.item);

    if (this.reason == '' || !this.reason) {
      return this.utility.presentFailureToast('Please Enter reason');
    }
    let data = {
      id: this.item_id,
      type: this.tag,
      reason: this.reason,
    };
    const res = await this.network.postReason(data);
    if (res) {
      this.utility.presentToast('Reported Success');
      this.events.publish('UPDATE_POSTS');
      this.close();
    }
  }
  close() {
    this.modals.dismiss();
  }
}
