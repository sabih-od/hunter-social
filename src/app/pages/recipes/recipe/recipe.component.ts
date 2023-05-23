import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

@Component({
  selector: 'recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent extends BasePage implements OnInit {
  @Input() item;
  rating = 1;
  constructor(injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    if (this.item.auth_review) this.rating = this.item.auth_review.rating;
    this.userData = await this.users.getUser();
    console.log('USER', this.userData);
  }
  userData(arg0: string, userData: any) {
    throw new Error('Method not implemented.');
  }

  changeRate(_rating) {
    if (!this.item.auth_review) this.rating = _rating;
  }

  openPopup($event) {
    console.log(this.item);
    if (this.item.is_reported) {
      this.alert.presentFailureToast('Already reported!');
    } else {
      this.alert.presentPopoverReportingComponent($event, {
        item_id: this.item.id,
        item_desc: this.item.content,
        tag: 'recipe',
      });
    }
  }

  openLink() {
    window.open(this.item.link);
  }

  async rateRecipe() {
    let res = await this.network.rateRecipe(this.item.id, this.rating);
    console.log('rateRecipe', res);

    if (res && res.data)
      this.events.publish('RECEIPE_UPDATED', {
        id: this.item.id,
        rating: this.rating,
      });
    else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async deleteRecipe() {
    let isConfirm = await this.alert.presentConfirm(
      'Yes',
      'No',
      'Confirm delete',
      'Are you sure want to delete this recipe?'
    );
    if (isConfirm) {
      let res = await this.network.deleteRecipe(this.item.id);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.events.publish('RECEIPE_UPDATED');
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }

  async editRecipe() {
    let res = await this.modals.present(AddRecipeComponent, {
      item: this.item,
    });
    this.events.publish('RECEIPE_UPDATED');
  }

  viewProfile(user_id) {
    this.nav.push('pages/profile', { user_id });
  }
}
