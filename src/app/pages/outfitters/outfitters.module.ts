import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutfittersPageRoutingModule } from './outfitters-routing.module';

import { OutfittersPage } from './outfitters.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { OutfitterModule } from './outfitter/outfitter.module';
import { OutfitterBannerComponent } from './outfitter-banner/outfitter-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutfittersPageRoutingModule,
    HeaderModule,
    OutfitterModule,
    FooterModule,
    ChatFloatingButtonModule

  ],
  declarations: [OutfittersPage, OutfitterBannerComponent],
})
export class OutfittersPageModule {}
