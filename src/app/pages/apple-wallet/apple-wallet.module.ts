import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppleWalletPageRoutingModule } from './apple-wallet-routing.module';

import { AppleWalletPage } from './apple-wallet.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    IonicModule,
    AppleWalletPageRoutingModule
  ],
  declarations: [AppleWalletPage]
})
export class AppleWalletPageModule {}
