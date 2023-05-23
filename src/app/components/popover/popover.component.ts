import { Component, Injector, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { ReportPage } from 'src/app/pages/report/report.page';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent extends BasePage implements OnInit {
  data: any;
  @Input() user_id: any;
  isOwnProfile: boolean;
  current_user: any;
  user_profile: any;
  connections_count: any;
  getUser: any;
  showDelete = false;
  showReport = false;

  constructor(injector: Injector, public popover: PopoverController) {
    super(injector);
  }

  ngOnInit() {}

  async initialize() {
    this.getUser();
    this.current_user = await this.users.getUser();
    this.isOwnProfile = this.current_user.id == this.user_id;
    console.log(this.isOwnProfile);
    const user_profile_data = await this.network.getUserProfile(this.user_id);
    this.user_profile = user_profile_data.data;
    if (this.isOwnProfile) this.dataService.user_data = this.user_profile;
    this.user_id;
  }

  async ionViewWillEnter() {
    this.current_user = await this.users.getUser();

    console.log('userid', this.current_user.id, this.data.user_id);

    // if(this.data.user_id === this.current_user.id){
    this.showDelete = this.data.user_id === this.current_user.id;
    // } else {
    this.showReport = this.data.user_id !== this.current_user.id;
    // }
  }

  async openreport() {
    var res = await this.modals.present(ReportPage, {
      tag: this.data.tag,
      item_id: this.data.item_id,
      item_desc: this.data.item_desc,
    });
  }
  async deleteComment() {
    console.log(this.data);
    let res = await this.network.deleteHowToComment(this.data.item_id);
    if (res && res.data) {
      this.events.publish('HOW_TO_POST_UPDATED');
      this.events.publish('HOW_TO_POST_UPDATED_DELETECOMMENT');
      this.popover.dismiss();
    } else {
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }

    // var res = await this.modals.present(ReportPage, {
    //   tag: this.data.tag,
    //   item_id: this.data.item_id,
    //   item_desc: this.data.item_desc,
    // });
  }

  ab(flag) {
    if (flag) {
      this.openreport();
    } else {
      this.deleteComment();
    }
  }
}
