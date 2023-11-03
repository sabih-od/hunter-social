import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpSubmitPageRoutingModule } from './otp-submit-routing.module';

import { OtpSubmitPage } from './otp-submit.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { FeebackModule } from 'src/app/components/feeback/feeback.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpSubmitPageRoutingModule,
    ReactiveFormsModule,
    FooterModule,
    FeebackModule
  ],
  declarations: [OtpSubmitPage]
})
export class OtpSubmitPageModule {}
