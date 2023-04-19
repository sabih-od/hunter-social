import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutfittersPage } from './outfitters.page';

const routes: Routes = [
  {
    path: '',
    component: OutfittersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutfittersPageRoutingModule {}
