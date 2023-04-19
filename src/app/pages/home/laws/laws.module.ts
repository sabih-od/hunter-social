import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LawsComponent } from './laws.component';

@NgModule({
  declarations: [LawsComponent],
  imports: [CommonModule, IonicModule],
  exports: [LawsComponent],
})
export class LawsModule {}
