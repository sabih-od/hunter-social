import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DrawerComponent } from './drawer.component';
import { MenuHeaderModule } from '../menu-header/menu-header.module';
import { MenuItemModule } from '../menu-item/menu-item.module';
import { MenuFooterModule } from '../menu-footer/menu-footer.module';

@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    IonicModule,
    MenuHeaderModule,
    MenuItemModule,
    MenuFooterModule,
  ],
  exports: [DrawerComponent],
})
export class DrawerModule {}
