import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DrawerComponent } from './drawer.component';
import { MenuHeaderModule } from '../menu-header/menu-header.module';
import { MenuItemModule } from '../menu-item/menu-item.module';
import { MenuFooterModule } from '../menu-footer/menu-footer.module';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
// import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { DisclaimerModule } from '../disclaimer/disclaimer.module';

@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    IonicModule,
    MenuHeaderModule,
    MenuItemModule,
    MenuFooterModule,
    HeaderModule,
    FooterModule,
    DisclaimerModule
  ],
  exports: [DrawerComponent],
})
export class DrawerModule { }
