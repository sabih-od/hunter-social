import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { PrivacyPage } from '../privacy/privacy.page';
// import { FeebackComponent } from 'src/app/components/feeback/feeback.component';
import { FeebackModule } from 'src/app/components/feeback/feeback.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    HeaderModule,
    FeebackModule

  ],
  declarations: [
    SignupPage,
    // FeebackComponent,
    PrivacyPage,
  ],
  providers: [],

})
export class SignupPageModule { }
