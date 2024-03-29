import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage extends BasePage implements OnInit {
  recipies = [];
  page_num = 1;
  last_page;
  constructor(injector: Injector) {
    super(injector);
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getData();
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.events.subscribe('RECEIPE_UPDATED', (data) => {
      console.log('recipe_updated');
      this.getData();
      // this.recipies = this.recipies.map((x) =>
      //   x.id !== data.id
      //     ? x
      //     : {
      //         ...x,
      //         auth_review: {
      //           rating: data.rating,
      //         },
      //         reviews_count: (x.reviews_count += 1),
      //         rating: Math.round(x.total_reviews / (x.reviews_count + 1)),
      //       }
      // );
      // this.getData();
    });
    // this.addNew();
    this.getData();
    // this.recipies = this.dataService.getGameRecepies();
  }

  async getData() {
    let res = await this.network.getrecipes(
      this.page_num > 1 ? this.page_num : null
    );
    let user = await this.users.getUser();
    console.log('getrecipes', res);
    if (res && res.data) {
      this.recipies = [
        ...this.recipies,
        ...res.data.data.map((x) => ({
          ...x,
          created_by_me: x.user_id === user.id,

          rating: Math.round(x.total_reviews / x.reviews_count),
          profile_image: this.users.getProfileImage(x.user.profile_image),
        })),
      ];
      this.last_page = res.data.last_page;
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async addNew() {
    let res = await this.modals.present(AddRecipeComponent);
    if (res && res.data.success) this.getData();
  }

  loadMore() {
    this.page_num++;
    this.getData();
  }
}
