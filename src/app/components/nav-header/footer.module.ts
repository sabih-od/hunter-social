import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavHeaderComponent } from './nav-header.component';

@NgModule({
  declarations: [NavHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [NavHeaderComponent],
})
export class NavHeaderModule {}
