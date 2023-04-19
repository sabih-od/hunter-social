import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { StoreRowModule } from './store-row/store-row.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    HeaderModule,
    StoreRowModule,
  ],
  declarations: [CartPage],
})
export class CartPageModule {}
