import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppSearchComponent } from './app-search.component';

@NgModule({
  declarations: [AppSearchComponent],
  imports: [CommonModule, IonicModule],
  exports: [AppSearchComponent],
})
export class AppSearchModule {}
