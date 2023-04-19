import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketplacePageRoutingModule } from './marketplace-routing.module';

import { MarketplacePage } from './marketplace.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { MarketplaceBannerComponent } from './marketplace-banner/marketplace-banner.component';
import { MarketplaceRowModule } from './marketplace-row/marketplace-row.module';
import { ProductDetailsModule } from './product-details/product-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketplacePageRoutingModule,
    FooterModule,
    HeaderModule,
    MarketplaceRowModule,
    ProductDetailsModule
  ],
  declarations: [MarketplacePage, MarketplaceBannerComponent],
})
export class MarketplacePageModule {}
