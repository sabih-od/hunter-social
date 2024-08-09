import { Component, Injector, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BasePage } from '../../base-page/base-page';
import { PostAdventureContentPage } from '../../post-adventure-content/post-adventure-content.page';
import { CommentsComponent } from '../comments/comments.component';
import { MenusComponent } from '../menus/menus.component';
import { SocialMenusComponent } from '../social-menus/social-menus.component';
import { ReportPage } from '../../report/report.page';

@Component({
  selector: 'adventure-item',
  templateUrl: './adventure-item.component.html',
  styleUrls: ['./adventure-item.component.scss'],
})
export class AdventureItemComponent extends BasePage implements OnInit {
  show = false;
  @Input() item: any;
  contentLabel = '';
  likerstext = '';
  userid: string;

  constructor(injector: Injector, public popoverController: PopoverController) {
    super(injector);
  }

  ngOnInit() {
    // Initialization logic if any
  }

  generateLikeMessage(likers) {
    const likerNames = likers.map(liker => liker.name);

    if (likerNames.length === 1) {
      return `${likerNames[0]} liked`;
    } else if (likerNames.length === 2) {
      return `${likerNames[0]} and ${likerNames[1]} liked`;
    } else if (likerNames.length > 2) {
      const othersCount = likerNames.length - 2;
      return `${likerNames[0]}, ${likerNames[1]}, and ${othersCount} others liked`;
    } else {
      return "No likes";
    }
  }

  async openPopup(event: Event) {
    if (!this.item.is_reported) {
      this.alert.presentPopoverReportingComponent(event, {
        item_id: this.item.id,
        item_desc: this.item.content,
        tag: 'post',
      });
    } else {
      this.alert.presentFailureToast('Already reported!');
    }
  }

  async getuser() {
    const user = await this.users.getUser();
    this.userid = user?.id;
    this.likerstext = this.generateLikeMessage(this.item?.likers?.data);
  }

  async like() {
    let res = await this.network.likePost(this.item.id);
    if (this.item.has_liked) {
      this.item.count_likes--;
    } else {
      this.item.count_likes++;
    }
    this.item.has_liked = !this.item.has_liked;
  }

  async showComments() {
    let res = await this.modals.present(CommentsComponent, {
      commments: this.item.comments,
      post_id: this.item.id,
    });

    if (res.data.refresh) {
      this.item.count_comments++;
      this.item.comments = res.data.comments;
    }
  }

  async showMenu(event: Event) {
    let menu = await this.popoverController.create({
      component: MenusComponent,
      event: event,
    });
    await menu.present();
    let data = await menu.onDidDismiss();
    if (data.data?.type === 'delete') {
      this.deletePost();
    } else if (data.data?.type === 'edit') {
      let res = await this.modals.present(PostAdventureContentPage, {
        item: this.item,
      });
      if (res && res.data.refresh) {
        this.events.publish('UPDATE_POSTS');
      }
    }
  }

  async deletePost() {
    let confirm = await this.utility.alerts.presentConfirm(
      'Confirm',
      'Cancel',
      'Confirmation',
      'Are you sure want to delete this post?'
    );
    if (confirm === true) {
      let res = await this.network.deletePost(this.item.id);
      if (res && res.data?.post) {
        this.utility.presentSuccessToast(res.message);
        this.events.publish('POST_DELETED', { data: this.item.id });
      } else {
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
      }
    }
  }

  async share(event: Event) {
    let menu = await this.popoverController.create({
      component: SocialMenusComponent,
      event: event,
    });
    await menu.present();
    let data = await menu.onDidDismiss();
    if (data.data?.type) {
      this.onSocialShare(data.data?.type);
    }
  }

  onSocialShare(type: string) {
    switch (type) {
      case 'Facebook':
        this.utility.openExternalUrl(
          'https://www.facebook.com/sharer/sharer.php?u=https://custom.designwebdemos.com/hunter_social.com/public',
          '_system'
        );
        break;
      case 'Twitter':
        this.utility.openExternalUrl(
          'https://twitter.com/intent/tweet?text=Check this out&url=https://custom.designwebdemos.com/hunter_social.com/public&hashtags=hunterSocial',
          '_system'
        );
        break;
      case 'Linkedin':
        this.utility.openExternalUrl(
          'https://www.linkedin.com/sharing/share-offsite/?url=https://custom.designwebdemos.com/hunter_social.com/public',
          '_system'
        );
        break;
    }
  }

  goToProfile(item: any) {
    this.nav.navigateTo('pages/profile', {
      queryParams: { user_id: item.user.id },
    });
  }
}
