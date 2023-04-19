import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OutfitterComponent } from './outfitter.component';

@NgModule({
  declarations: [OutfitterComponent],
  imports: [CommonModule, IonicModule],
  exports: [OutfitterComponent],
})
export class OutfitterModule {}
