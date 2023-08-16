import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HikingPageRoutingModule } from './hiking-routing.module';

import { HikingPage } from './hiking.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HikingPageRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [HikingPage]
})
export class HikingPageModule {}
