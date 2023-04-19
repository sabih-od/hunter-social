import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebViewPageRoutingModule } from './web-view-routing.module';

import { WebViewPage } from './web-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebViewPageRoutingModule
  ],
  declarations: [WebViewPage]
})
export class WebViewPageModule {}
