import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LureItemComponent } from './lure-item.component';

@NgModule({
  declarations: [LureItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [LureItemComponent],
})
export class LureItemModule {}
