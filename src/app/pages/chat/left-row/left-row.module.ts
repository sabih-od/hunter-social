import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LeftRowComponent } from './left-row.component';

@NgModule({
  declarations: [LeftRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [LeftRowComponent],
})
export class LeftRowModule {}
