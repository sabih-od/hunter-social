import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsComponent } from './promotions.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PromotionsComponent],
  imports: [CommonModule, IonicModule],
  exports: [PromotionsComponent],
})
export class PromotionsModule {}
