import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdventureItemComponent } from './adventure-item.component';
@NgModule({
  declarations: [AdventureItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [AdventureItemComponent],
})
export class AdventureItemModule {}
