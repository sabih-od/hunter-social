import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostAdventureContentPageRoutingModule } from './post-adventure-content-routing.module';

import { PostAdventureContentPage } from './post-adventure-content.page';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostAdventureContentPageRoutingModule,
  ],
  declarations: [PostAdventureContentPage],
})
export class PostAdventureContentPageModule {}
