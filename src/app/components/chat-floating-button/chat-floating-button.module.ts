import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChatFloatingButtonComponent } from './chat-floating-button.component';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { ChatBatsComponent } from '../chat-bats/chat-bats.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PeopleModule } from '../peoples/people-row/people.module';
import { MenuComponent } from 'src/app/pages/chat-room/menu/menu.component';
// import { PeoplesComponent } from '../peoples/peoples.component';
import { PeopleComponent } from '../peoples/people-row/people.component';
import { MenuNotFriendComponent } from 'src/app/pages/chat-room/menu-not-friend/menu-not-friend.component';
import { MenuComponent as Menu2Component } from 'src/app/pages/chat-rooms/menu/menu.component';
import { ChatRowModule } from 'src/app/pages/chat-room/chat-row/chat-row.module';
import { ChatRowModule as ChatRow2Module } from 'src/app/pages/chat-rooms/chat-row/chat-row.module';
import { ChatRoomsComponent } from '../chat-rooms/chat-rooms.component';
import { FormsModule } from '@angular/forms';
import { DatingComponent } from '../dating/dating.component';
import { DatingFilterComponent } from 'src/app/pages/dating/dating-filter/dating-filter.component';
import { DatingItemComponent } from 'src/app/pages/dating/dating-item/dating-item.component';
// import { ChatRowComponent } from 'src/app/pages/chat-room/chat-row/chat-row.component';
// import { ChatRowComponent as ChatRowComponent2 } from 'src/app/pages/chat-rooms/chat-row/chat-row.component';

@NgModule({
  declarations: [
    ChatFloatingButtonComponent,
    ChatRoomComponent,
    ChatBatsComponent,
    MenuComponent,
    // PeoplesComponent,
    PeopleComponent,
    MenuNotFriendComponent,
    Menu2Component,
    ChatRoomsComponent,
    DatingComponent,
    DatingFilterComponent,
    DatingItemComponent,
    // ChatRowComponent,
    // ChatRowComponent2,
  ],
  imports: [
    CommonModule,
    IonicModule,
    PeopleModule,
    Ng2SearchPipeModule,
    ChatRowModule,
    ChatRow2Module,
    FormsModule,
  ],
  exports: [ChatFloatingButtonComponent],
})
export class ChatFloatingButtonModule { }
