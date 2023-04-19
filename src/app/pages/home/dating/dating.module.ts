import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DatingComponent } from './dating.component';

@NgModule({
  declarations: [DatingComponent],
  imports: [CommonModule, IonicModule],
  exports: [DatingComponent],
})
export class DatingModule {}
