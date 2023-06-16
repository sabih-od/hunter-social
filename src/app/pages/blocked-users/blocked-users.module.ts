import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockedUsersPageRoutingModule } from './blocked-users-routing.module';

import { BlockedUsersPage } from './blocked-users.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { EditBannerComponent } from '../edit-profile/edit-banner/edit-banner.component';
import { DatingItemModule } from '../dating/dating-item/dating-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockedUsersPageRoutingModule,
    HeaderModule,
    DatingItemModule,
  ],
  declarations: [BlockedUsersPage, EditBannerComponent]
})
export class BlockedUsersPageModule {}
