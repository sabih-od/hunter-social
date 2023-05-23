import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { ReportPage } from '../../report/report.page';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent extends BasePage implements OnInit {
  visibleIndex = -1;
  _comments;
  _post_id;
  comment;
  userData;
  item: any;

  @Input() set commments(val) {
    this._comments = val?.map((item) => ({
      ...item,
      user: {
        ...item.user,
        profile_image: this.image.getImageUrl(item.user.profile_image),
      },
    }));
    console.log('this._comments', this._comments);
  }

  get commments() {
    return this._comments;
  }

  @Input() set post_id(val) {
    this._post_id = val;
  }

  get post_id() {
    return this._post_id;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    this.userData = await this.users.getUser();
    console.log('USER', this.userData);

    this.events.subscribe('HOW_TO_POST_UPDATED_DELETECOMMENT', () => {
      this.modals.dismiss();
    });
  }

  openPopup(item: any, $event) {

    console.log(item);
    if (item.is_reported == false)
      this.alert.presentPopoverReportingComponent($event, {
        item_id: item.id,
        item_desc: item.comment,
        user_id: item.user_id,
        tag: 'comment',
      });
    else {
      this.alert.presentFailureToast('Already reported!');
    }
  }

  async addComment() {
    console.log(this.comment);

    if (!this.comment || this.comment === '') return;

    let res = await this.network.addComment({
      comment: this.comment,
      post_id: this._post_id,
    });
    console.log(res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.close(true, res.data.comments);
    }
  }
  async openreport(item) {
    console.log('ReportComponent', item);

    await this.modals.present(ReportPage);
  }

  close(refresh, comments) {
    this.modals.dismiss({ refresh: refresh, comments });
  }

  showSubItem(ind) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
}
