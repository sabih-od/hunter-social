import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsPageRoutingModule } from './notifications-routing.module';

import { NotificationsPage } from './notifications.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    FooterModule,
    HeaderModule,
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
