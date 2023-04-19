import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NationwideLawsPage } from './nationwide-laws.page';

const routes: Routes = [
  {
    path: '',
    component: NationwideLawsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NationwideLawsPageRoutingModule {}
