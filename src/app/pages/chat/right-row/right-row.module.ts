import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RightRowComponent } from './right-row.component';

@NgModule({
  declarations: [RightRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [RightRowComponent],
})
export class RightRowModule {}
