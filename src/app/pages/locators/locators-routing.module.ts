import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocatorsPage } from './locators.page';

const routes: Routes = [
  {
    path: '',
    component: LocatorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocatorsPageRoutingModule {}
