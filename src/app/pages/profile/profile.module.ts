import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ProfileBannerComponent } from './profile-banner/profile-banner.component';
import { ProfileUIComponent } from './profile-ui/profile-ui.component';
import { AdventureItemModule } from '../post-adventure/adventure-item/adventure-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    HeaderModule,
    AdventureItemModule
  ],
  declarations: [ProfilePage, ProfileBannerComponent, ProfileUIComponent]
})
export class ProfilePageModule {}
