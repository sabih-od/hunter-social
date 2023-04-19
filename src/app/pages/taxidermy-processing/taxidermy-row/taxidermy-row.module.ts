import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TaxidermyRowComponent } from './taxidermy-row.component';

@NgModule({
  declarations: [TaxidermyRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [TaxidermyRowComponent],
})
export class TaxidermyRowModule {}
