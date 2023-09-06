import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentReviewsListPageRoutingModule } from './equipment-reviews-list-routing.module';

import { EquipmentReviewsListPage } from './equipment-reviews-list.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ReviewComponent } from './review/review.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CustomFilterPipe } from 'src/app/pipes/custom-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentReviewsListPageRoutingModule,
    HeaderModule,
    Ng2SearchPipeModule,
  ],
  declarations: [EquipmentReviewsListPage, ReviewComponent, AddReviewComponent, CustomFilterPipe],
})
export class EquipmentReviewsListPageModule {}
