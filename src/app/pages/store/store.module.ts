import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StorePageRoutingModule } from './store-routing.module';

import { StorePage } from './store.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { StoreRowModule } from './store-row/store-row.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StoreBannerComponent } from './store-banner/store-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StorePageRoutingModule,
    HeaderModule,
    StoreRowModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
  ],
  declarations: [StorePage, StoreBannerComponent],
})
export class StorePageModule {}
