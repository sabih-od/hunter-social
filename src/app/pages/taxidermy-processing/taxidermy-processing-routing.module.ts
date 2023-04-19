import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxidermyProcessingPage } from './taxidermy-processing.page';

const routes: Routes = [
  {
    path: '',
    component: TaxidermyProcessingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxidermyProcessingPageRoutingModule {}
