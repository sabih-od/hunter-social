import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripePaymentPageRoutingModule } from './stripe-payment-routing.module';

import { StripePaymentPage } from './stripe-payment.page';
import { HeaderModule } from 'src/app/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripePaymentPageRoutingModule,
    HeaderModule,
    ReactiveFormsModule,
  ],
  declarations: [StripePaymentPage],

})
export class StripePaymentPageModule {}
