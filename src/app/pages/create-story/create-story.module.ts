import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateStoryPageRoutingModule } from './create-story-routing.module';

import { CreateStoryPage } from './create-story.page';
import { DirectivesModule } from 'src/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateStoryPageRoutingModule,
    DirectivesModule
  ],
  declarations: [CreateStoryPage]
})
export class CreateStoryPageModule {}
