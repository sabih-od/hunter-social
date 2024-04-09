import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesPage } from './pages.page';
import { DisclaimerModule } from '../components/disclaimer/disclaimer.module';

@NgModule({
  declarations: [PagesPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PagesRoutingModule,
    DisclaimerModule
  ],
})
export class PagesModule { }
