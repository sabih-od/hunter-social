import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppleWalletPage } from './apple-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: AppleWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppleWalletPageRoutingModule {}
