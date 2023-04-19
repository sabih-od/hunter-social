import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxidermyPage } from './taxidermy.page';

const routes: Routes = [
  {
    path: '',
    component: TaxidermyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxidermyPageRoutingModule {}
