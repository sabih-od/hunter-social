import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DatingItemComponent } from './dating-item.component';

@NgModule({
  declarations: [DatingItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [DatingItemComponent],
})
export class DatingItemModule {}
