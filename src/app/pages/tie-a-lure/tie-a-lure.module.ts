import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TieALurePageRoutingModule } from './tie-a-lure-routing.module';

import { TieALurePage } from './tie-a-lure.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { LureItemModule } from './lure-item/lure-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TieALurePageRoutingModule,
    HeaderModule,
    LureItemModule,
  ],
  declarations: [TieALurePage],
})
export class TieALurePageModule {}
