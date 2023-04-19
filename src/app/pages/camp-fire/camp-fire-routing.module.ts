import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampFirePage } from './camp-fire.page';

const routes: Routes = [
  {
    path: '',
    component: CampFirePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampFirePageRoutingModule {}
