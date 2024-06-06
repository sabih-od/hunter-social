import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { PopoverController } from '@ionic/angular';
import { MenusComponent } from '../../post-adventure/menus/menus.component';

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
  addcommentloader = false;
  constructor(injector: Injector, public popoverController: PopoverController) {
    super(injector);
  }

  async ngOnInit() {
    let user = await this.users.getUser();
    this.profile_image = this.users.getProfileImage(user.profile_image);
    this.getComments();
  }

  async openPopup($event) {
    if (this.item.is_reported) {
      this.alert.presentFailureToast('Already reported!');
    } else {
      await this.alert.presentPopoverReportingComponent($event, {
        item_id: this.item.id,
        item_desc: this.item.content,
        tag: 'comment',
      });
      this.getComments();
    }
  }

  // async showMenu($event) {
  //   let menu = await this.popoverController.create({
  //     component: MenusComponent,
  //     event: $event,
  //   });
  //   menu.present();
  //   let data = await menu.onDidDismiss();
  //   if (data.data?.type === 'delete') this.deletePost();
  //   else if (data.data?.type === 'edit') {
  //     let res = await this.modals.present(CardSubmissionComponent, {
  //       item: this.item,
  //     });
  //     if (res && res.data.refresh) this.events.publish('UPDATE_POSTS');
  //   }
  // }

  async deleteVideo() {
    let res = await this.network.deleteHowToVideo(this.item.id);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('HOW_TO_POST_UPDATED');
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async addComment() {
    if (this.addcommentloader && this.comment != '') return;
    if (!this.utility.isNullOrEmpty(this.comment)) {
      this.addcommentloader = true;
      let res = await this.network.commentHowToVideo(
        this.item.id,
        this.comment
      );
      if (res && res.data) {
        this.addcommentloader = false;
        const curruser = await this.users.getUser();
        this.comments.push({
          id: res.data.id,
          comment: this.comment,
          user_id: curruser.id,
          selfComment: true,
          user: {
            ...curruser,
            profile_image: this.users.getProfileImage(curruser.profile_image),
          }
        });
        this.comment = '';
      } else
        this.addcommentloader = false;
      this.utility.presentFailureToast(
        res?.message ?? 'Something Went Wrong'
      );
    }
  }

  async getComments() {
    let user = await this.users.getUser();
    let res = await this.network.getHowToVideoComments(this.item.id);

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
    if (res && res.data) {
      this.comments = this.comments.filter(x => x.id != item.id);
      // this.events.publish('HOW_TO_POST_UPDATED');
    }
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  viewProfile(user_id) {
    this.nav.push('pages/profile', { user_id });
  }

  editVideo() {
    this.events.publish('EDIT_VIDEO', this.item);
  }
}
