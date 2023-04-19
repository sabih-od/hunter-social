import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocatorComponent } from './locator.component';

@NgModule({
  declarations: [LocatorComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocatorComponent],
})
export class LocatorModule {}
