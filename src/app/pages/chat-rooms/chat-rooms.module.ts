import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-rooms-routing.module';

import { ChatRoomsPage } from './chat-rooms.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ChatRowModule } from './chat-row/chat-row.module';
import { MenuComponent } from './menu/menu.component';
import { PeoplesComponent } from 'src/app/components/peoples/peoples.component';
import { PeopleComponent } from 'src/app/components/peoples/people-row/people.component';
import { MenuNotFriendComponent } from './menu-not-friend/menu-not-friend.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChatroomBannerComponent } from './chatroom-banner/chatroom-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPageRoutingModule,
    HeaderModule,
    ChatRowModule,
    Ng2SearchPipeModule,
    FooterModule,
    ChatFloatingButtonModule
  ],
  declarations: [
    ChatRoomsPage,
    MenuComponent,
    PeoplesComponent,
    PeopleComponent,
    MenuNotFriendComponent,
    ChatroomBannerComponent,
  ],
})
export class ChatRoomsPageModule {}
