import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxidermyProcessingPageRoutingModule } from './taxidermy-processing-routing.module';

import { TaxidermyProcessingPage } from './taxidermy-processing.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { TaxidermyRowModule } from './taxidermy-row/taxidermy-row.module';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxidermyProcessingPageRoutingModule,
    HeaderModule,
    TaxidermyRowModule,
    FooterModule,
  ],
  declarations: [TaxidermyProcessingPage],
})
export class TaxidermyProcessingPageModule {}
