import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostAdventureContentPage } from './post-adventure-content.page';

const routes: Routes = [
  {
    path: '',
    component: PostAdventureContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostAdventureContentPageRoutingModule {}
