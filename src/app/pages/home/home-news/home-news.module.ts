import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomeNewsComponent } from './home-news.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [HomeNewsComponent],
  exports: [HomeNewsComponent],
})
export class HomeNewsModule {}
