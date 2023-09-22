import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { ChatRowModule } from '../chat-rooms/chat-row/chat-row.module';
import { ChatRowModule as ChatRow2Module } from '../chat-room/chat-row/chat-row.module';
import { ChatRowComponent } from 'src/app/pages/chat-room/chat-row/chat-row.component';
import { ChatRowComponent as ChatRowComponent2 } from 'src/app/pages/chat-rooms/chat-row/chat-row.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    FooterModule,
    HeaderModule,
    ChatFloatingButtonModule,

    ChatRowModule,
    ChatRow2Module,
  ],
  declarations: [DashboardPage,
  
    ChatRowComponent,
    ChatRowComponent2,
  ]
})
export class DashboardPageModule { }
