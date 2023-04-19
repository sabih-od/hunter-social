import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqipmentAddReviewComponent } from './eqipment-add-review.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EqipmentAddReviewComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [EqipmentAddReviewComponent],
})
export class EqipmentAddReviewModule {}
