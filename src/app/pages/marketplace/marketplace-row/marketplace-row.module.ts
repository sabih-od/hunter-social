import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MarketplaceRowComponent } from './marketplace-row.component';
import { ProductDetailsModule } from '../product-details/product-details.module';

@NgModule({
  declarations: [MarketplaceRowComponent],
  imports: [CommonModule, IonicModule,FormsModule,ProductDetailsModule],
  exports: [MarketplaceRowComponent],
})
export class MarketplaceRowModule {}
