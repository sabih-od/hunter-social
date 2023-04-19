import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RanchLocatorPage } from './ranch-locator.page';

const routes: Routes = [
  {
    path: '',
    component: RanchLocatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RanchLocatorPageRoutingModule {}
