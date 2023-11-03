import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

import { ResetPasswordPage } from './reset-password.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { FeebackComponent } from 'src/app/components/feeback/feeback.component';
import { FeebackModule } from 'src/app/components/feeback/feeback.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordPageRoutingModule,
    ReactiveFormsModule,
    FooterModule,
    FeebackModule
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
