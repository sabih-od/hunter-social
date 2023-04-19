import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebViewPage } from './web-view.page';

const routes: Routes = [
  {
    path: '',
    component: WebViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebViewPageRoutingModule {}
