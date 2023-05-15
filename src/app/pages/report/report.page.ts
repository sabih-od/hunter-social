import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage extends BasePage implements OnInit {
  user_id: any;
  @Input() tag: any='';
  @Input() id: any='';
  reason: any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    // let user = await this.users.getUser();
    console.log('id', this.id);
    // this.user_id = user.id;
  }
  async submit() {
    let data = {
      id: this.id,
      type: this.tag,
      reason: this.reason,
    };
    const res = await this.network.postReason(data);
    console.log(res);
    if(res){
      this.close();
    }
  }
  close() {
    this.modals.dismiss();
  }
}
