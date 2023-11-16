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
  constructor(injector: Injector, public popoverController: PopoverController) {
    super(injector);
  }
  likerstext = '';
  userid

  ngOnInit() {
    // console.log(this.item);


    // this.likerstext = '';
    // if (this.item.has_liked && this.item?.likers?.data.length == 1) { this.likerstext += 'You liked'; }
    // else if (this.item.has_liked && this.item?.likers?.data.length == 2) { this.likerstext += 'You and '; }

    // this.item?.likers?.data.map(x => {
    //   this.likerstext += `${x.name} and ${this.item?.likers?.data.length - 1} likes`;
    //   return;
    // })
    // this.getuser()
    // const likers = this.item?.likers?.data.filter(user => {
    //   console.log('user.pivot.user_id => ', user.pivot.user_id)
    //   user.pivot.user_id == this.userid
    // });
    // console.log('likers => ', likers)
    // const likeMessage = this.generateLikeMessage(likers);

    // console.log('likerstext => ', likeMessage)
    // console.log('this.item?.likers?.data.length => ', this.item?.likers?.data.length)

    // if(this.item.content === undefined){
    //   this.contentLabel = this.item.content;
    //   console.log("this.contentLabel",this.contentLabel);
    // } else{
    //   this.contentLabel = ""
    // }
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

  openPopup($event) {
    console.log(this.item);
    if (this.item.is_reported == false) {
      this.alert.presentPopoverReportingComponent($event, {
        item_id: this.item.id,
        item_desc: this.item.content,
        tag: 'post',
      });
    } else {
      this.alert.presentFailureToast('Already reported!');
    }
  }

  async like() {
    let res = await this.network.likePost(this.item.id);
    console.log(res);
    if (this.item.has_liked) this.item.count_likes--;
    else this.item.count_likes++;
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

  async showMenu($event) {
    let menu = await this.popoverController.create({
      component: MenusComponent,
      event: $event,
    });
    menu.present();
    let data = await menu.onDidDismiss();
    console.log(data);
    if (data.data?.type === 'delete') this.deletePost();
    else if (data.data?.type === 'edit') {
      let res = await this.modals.present(PostAdventureContentPage, {
        item: this.item,
      });
      console.log(res);
      if (res && res.data.refresh) this.events.publish('UPDATE_POSTS');
    }
  }

  async deletePost() {
    let confirm = await this.utility.alerts.presentConfirm(
      'Confirm',
      'Cancel',
      'Confirmation',
      'Are you sure want to delete this post?'
    );
    console.log(confirm);
    if (confirm === true) {
      let res = await this.network.deletePost(this.item.id);
      console.log('DELETE_POST_Response', res);
      if (res && res.data?.post) {
        this.utility.presentSuccessToast(res.message);
        this.events.publish('UPDATE_POSTS');
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }
  async share($event) {
    let menu = await this.popoverController.create({
      component: SocialMenusComponent,
      event: $event,
    });
    menu.present();
    let data = await menu.onDidDismiss();
    console.log(data);
    if (data.data?.type) this.onSocialShare(data.data?.type);
  }

  onSocialShare(type) {
    switch (type) {
      case 'Facebook':
        this.utility.openExternalUrl(
          'https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fu%3Dhttps%253A%252F%252Fcustom.designwebdemos.com%252Fhunter_social.com%252Fpublic%26title%3D0%26description%3D0%26quote%26hashtag%3D%2523hunterSocial&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_GB',
          '_system'
        );
        break;

      case 'Twitter':
        this.utility.openExternalUrl(
          'https://twitter.com/intent/tweet?text=0&url=https%3A%2F%2Fcustom.designwebdemos.com%2Fhunter_social.com%2Fpublic&hashtags=hunterSocial',
          '_system'
        );
        break;

      case 'Linkedin':
        this.utility.openExternalUrl(
          'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcustom.designwebdemos.com%2Fhunter_social.com%2Fpublic',
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
  //  async showPopover(){
  //    let popover = await this.popoverController.create({
  //       component: 'popover-example-page',
  //       event: ev,
  //       translucent: true,
  //     });
  //     currentPopover = popover;
  //     return popover.present();
  //   }
}
