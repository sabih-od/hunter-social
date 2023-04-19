import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuFooterComponent } from './menu-footer.component';

@NgModule({
  declarations: [MenuFooterComponent],
  imports: [CommonModule, IonicModule],
  exports: [MenuFooterComponent],
})
export class MenuFooterModule {}
