import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuItemComponent } from './menu-item.component';

@NgModule({
  declarations: [MenuItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [MenuItemComponent],
})
export class MenuItemModule {}
