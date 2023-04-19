import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NationwideLawsPageRoutingModule } from './nationwide-laws-routing.module';

import { NationwideLawsPage } from './nationwide-laws.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { LawsItemModule } from './laws-item/laws-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NationwideLawsPageRoutingModule,
    HeaderModule,
    LawsItemModule,
  ],
  declarations: [NationwideLawsPage],
})
export class NationwideLawsPageModule {}
