import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { EditBannerComponent } from './edit-banner/edit-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    HeaderModule,
  ],
  declarations: [EditProfilePage, EditBannerComponent],
})
export class EditProfilePageModule {}
