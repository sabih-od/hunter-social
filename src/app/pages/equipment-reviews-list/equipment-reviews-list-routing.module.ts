import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentReviewsListPage } from './equipment-reviews-list.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentReviewsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentReviewsListPageRoutingModule {}
