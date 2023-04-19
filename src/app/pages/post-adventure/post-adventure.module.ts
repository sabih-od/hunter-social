import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAdventurePageRoutingModule } from './post-adventure-routing.module';

import { PostAdventurePage } from './post-adventure.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { AdventureItemModule } from './adventure-item/adventure-item.module';
import { CommentsComponent } from './comments/comments.component';
import { MenusComponent } from './menus/menus.component';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { PostBannerComponent } from './post-banner/post-banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostAdventurePageRoutingModule,
    HeaderModule,
    AdventureItemModule,
    ChatFloatingButtonModule,
    Ng2SearchPipeModule,
    FooterModule,
  ],
  declarations: [
    PostAdventurePage,
    CommentsComponent,
    MenusComponent,
    PostBannerComponent,
  ],
})
export class PostAdventurePageModule {}
