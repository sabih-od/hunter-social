import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LawsItemComponent } from './laws-item.component';

@NgModule({
  declarations: [LawsItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [LawsItemComponent],
})
export class LawsItemModule {}
