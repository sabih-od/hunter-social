import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TieALurePage } from './tie-a-lure.page';

const routes: Routes = [
  {
    path: '',
    component: TieALurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TieALurePageRoutingModule {}
