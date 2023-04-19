import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HunterBranchesPage } from './hunter-branches.page';

const routes: Routes = [
  {
    path: '',
    component: HunterBranchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HunterBranchesPageRoutingModule {}
