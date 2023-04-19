import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { LeftRowModule } from './left-row/left-row.module';
import { RightRowModule } from './right-row/right-row.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    LeftRowModule,
    RightRowModule,
  ],
  declarations: [ChatPage],
})
export class ChatPageModule {}
