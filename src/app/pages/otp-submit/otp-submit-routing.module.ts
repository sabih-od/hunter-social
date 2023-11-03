import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpSubmitPage } from './otp-submit.page';

const routes: Routes = [
  {
    path: '',
    component: OtpSubmitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpSubmitPageRoutingModule {}
