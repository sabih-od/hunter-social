import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampFirePageRoutingModule } from './camp-fire-routing.module';

import { CampFirePage } from './camp-fire.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampFirePageRoutingModule,
    HeaderModule,
    ChatFloatingButtonModule,
  ],
  declarations: [CampFirePage],
})
export class CampFirePageModule {}
