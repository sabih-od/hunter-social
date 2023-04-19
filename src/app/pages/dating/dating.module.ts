import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatingPageRoutingModule } from './dating-routing.module';

import { DatingPage } from './dating.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { DatingItemModule } from './dating-item/dating-item.module';
import { UserDetailComponentComponent } from './user-detail-component/user-detail-component.component';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { DatingBannerComponent } from './dating-banner/dating-banner.component';
import { DatingFilterComponent } from './dating-filter/dating-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatingPageRoutingModule,
    HeaderModule,
    DatingItemModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
  ],
  declarations: [
    DatingPage,
    UserDetailComponentComponent,
    DatingBannerComponent,
    DatingFilterComponent,
  ],
})
export class DatingPageModule {}
