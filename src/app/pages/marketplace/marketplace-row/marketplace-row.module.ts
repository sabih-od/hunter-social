import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MarketplaceRowComponent } from './marketplace-row.component';
import { ProductDetailsModule } from '../product-details/product-details.module';
import { ImageViewerModalModule } from 'src/app/components/image-viewer-modal/image-viewer-modal.module';

@NgModule({
  declarations: [MarketplaceRowComponent],
  imports: [CommonModule, IonicModule,FormsModule,ProductDetailsModule, 
    ImageViewerModalModule],
  exports: [MarketplaceRowComponent],
})
export class MarketplaceRowModule {}
