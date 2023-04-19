import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentReviewsPage } from './equipment-reviews.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentReviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentReviewsPageRoutingModule {}
