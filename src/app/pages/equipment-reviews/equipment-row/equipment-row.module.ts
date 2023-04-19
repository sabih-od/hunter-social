import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EquipmentRowComponent } from './equipment-row.component';

@NgModule({
  declarations: [EquipmentRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [EquipmentRowComponent],
})
export class EquipmentRowModule {}
