import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-how-to-cards',
  templateUrl: './how-to-cards.component.html',
  styleUrls: ['./how-to-cards.component.scss'],
})
export class HowToCardsComponent extends BasePage implements OnInit {
  @Input() item;
  comment;
  profile_image;
  comments = [];
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    let user = await this.users.getUser();
    this.profile_image = this.users.getProfileImage(user.profile_image);
    this.getComments();
  }

  async deleteVideo() {
    let res = await this.network.deleteHowToVideo(this.item.id);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('HOW_TO_POST_UPDATED');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async addComment() {
    if (!this.utility.isNullOrEmpty(this.comment)) {
      let res = await this.network.commentHowToVideo(
        this.item.id,
        this.comment
      );
      if (res && res.data) {
        this.events.publish('HOW_TO_POST_UPDATED');
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something Went Wrong'
        );
    }
  }

  async getComments() {
    let user = await this.users.getUser();
    let res = await this.network.getHowToVideoComments(this.item.id);
    console.log('getComments', res);

    if (res && res.data) {
      this.comments = res.data.data.map((item) => ({
        ...item,
        user: {
          ...item.user,
          profile_image: this.users.getProfileImage(item.user?.profile_image),
        },
        selfComment: item.user_id === user.id,
      }));
    }
  }

  async deleteComment(item) {
    let res = await this.network.deleteHowToComment(item.id);
    if (res && res.data) this.events.publish('HOW_TO_POST_UPDATED');
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  viewProfile(user_id) {
    this.nav.push('pages/profile', { user_id });
  }

  editVideo() {
    console.log('Edit Video');
    this.events.publish('EDIT_VIDEO', this.item);
  }
}
