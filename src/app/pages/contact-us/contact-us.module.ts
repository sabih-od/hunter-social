import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPage } from './contact-us.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { ContactBannerComponent } from './contact-banner/contact-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactUsPageRoutingModule,
    HeaderModule,
    FooterModule,
    ChatFloatingButtonModule
  ],
  declarations: [ContactUsPage, ContactBannerComponent],
})
export class ContactUsPageModule {}
