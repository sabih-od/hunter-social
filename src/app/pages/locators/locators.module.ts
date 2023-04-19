import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocatorsPageRoutingModule } from './locators-routing.module';

import { LocatorsPage } from './locators.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { LocatorModule } from 'src/app/components/locator/locator.module';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocatorsPageRoutingModule,
    HeaderModule,
    LocatorModule,
    FooterModule,
  ],
  declarations: [LocatorsPage],
})
export class LocatorsPageModule {}
