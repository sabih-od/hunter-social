import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StoreRowComponent } from './store-row.component';

@NgModule({
  declarations: [StoreRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [StoreRowComponent],
})
export class StoreRowModule {}
