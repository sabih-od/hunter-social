import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryViewerPageRoutingModule } from './story-viewer-routing.module';

import { StoryViewerPage } from './story-viewer.page';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryViewerPageRoutingModule,
    DirectivesModule
  ],
  declarations: [StoryViewerPage]
})
export class StoryViewerPageModule {}
