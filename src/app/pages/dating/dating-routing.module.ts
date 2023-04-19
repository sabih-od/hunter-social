import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatingPage } from './dating.page';

const routes: Routes = [
  {
    path: '',
    component: DatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatingPageRoutingModule {}
