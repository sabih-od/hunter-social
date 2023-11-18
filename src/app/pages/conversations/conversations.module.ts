import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationsPageRoutingModule } from './conversations-routing.module';

import { ConversationsPage } from './conversations.page';
import { PeopleModule } from 'src/app/components/peoples/people-row/people.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChatRowModule } from '../chat-room/chat-row/chat-row.module';
import { ChatRowModule as ChatRow2Module } from '../chat-rooms/chat-row/chat-row.module';
import { ChatRoomComponent } from 'src/app/components/chat-room/chat-room.component';
import { PeopleComponent } from 'src/app/components/peoples/people-row/people.component';
import { ChatRoomsComponent } from 'src/app/components/chat-rooms/chat-rooms.component';
import { DatingFilterComponent } from '../dating/dating-filter/dating-filter.component';
import { DatingItemComponent } from '../dating/dating-item/dating-item.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HeaderModule } from 'src/app/components/header/header.module';
import { DatingComponent } from 'src/app/components/dating/dating.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsPageRoutingModule,
    PeopleModule,
    Ng2SearchPipeModule,
    ChatRowModule,
    ChatRow2Module,
    HeaderModule
  ],
  declarations: [ConversationsPage,
    ChatRoomComponent,
    PeopleComponent,
    // MenuNotFriendComponent,
    // Menu2Component,
    ChatRoomsComponent,
    DatingComponent,
    DatingFilterComponent,
    DatingItemComponent,
    // HeaderComponent
  ]
})
export class ConversationsPageModule { }
