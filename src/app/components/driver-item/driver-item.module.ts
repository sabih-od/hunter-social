import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DriverItemComponent } from './driver-item.component';

@NgModule({
  declarations: [DriverItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [DriverItemComponent],
})
export class DriverItemModule {}
