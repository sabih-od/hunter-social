import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAdventurePage } from './post-adventure.page';

const routes: Routes = [
  {
    path: '',
    component: PostAdventurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAdventurePageRoutingModule {}
