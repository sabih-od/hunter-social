import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentReviewsPageRoutingModule } from './equipment-reviews-routing.module';

import { EquipmentReviewsPage } from './equipment-reviews.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { EquipmentRowModule } from './equipment-row/equipment-row.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EquipmentBannerComponent } from './equipment-banner/equipment-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { EqipmentAddReviewModule } from './eqipment-add-review/eqipment-add-review.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentReviewsPageRoutingModule,
    HeaderModule,
    EquipmentRowModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
    EqipmentAddReviewModule,
  ],
  declarations: [EquipmentReviewsPage, EquipmentBannerComponent],
})
export class EquipmentReviewsPageModule {}
