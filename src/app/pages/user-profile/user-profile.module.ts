import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ProfileItemModule } from './profile-item/profile-item.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    HeaderModule,
    ProfileItemModule,
    ChatFloatingButtonModule,
  ],
  declarations: [UserProfilePage],
})
export class UserProfilePageModule {}
