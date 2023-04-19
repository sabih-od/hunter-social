import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxidermyPageRoutingModule } from './taxidermy-routing.module';

import { TaxidermyPage } from './taxidermy.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { TaxidermyBannerComponent } from './taxidermy-banner/taxidermy-banner.component';
import { TaxidermyProcessingPageRoutingModule } from '../taxidermy-processing/taxidermy-processing-routing.module';
import { TaxidermyRowModule } from '../taxidermy-processing/taxidermy-row/taxidermy-row.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxidermyPageRoutingModule,
    HeaderModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
    TaxidermyProcessingPageRoutingModule,
    TaxidermyRowModule,
  ],
  declarations: [TaxidermyPage, TaxidermyBannerComponent],
})
export class TaxidermyPageModule {}
