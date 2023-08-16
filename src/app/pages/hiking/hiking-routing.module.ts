import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HikingPage } from './hiking.page';

const routes: Routes = [
  {
    path: '',
    component: HikingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HikingPageRoutingModule {}
