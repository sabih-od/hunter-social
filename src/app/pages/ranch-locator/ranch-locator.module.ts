import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RanchLocatorPageRoutingModule } from './ranch-locator-routing.module';

import { RanchLocatorPage } from './ranch-locator.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { RanchBannerComponent } from './ranch-banner/ranch-banner.component';
import { RanchTexasComponent } from './ranch-texas/ranch-texas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RanchLocatorPageRoutingModule,
    HeaderModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
  ],
  declarations: [RanchLocatorPage, RanchBannerComponent, RanchTexasComponent],
})
export class RanchLocatorPageModule {}
