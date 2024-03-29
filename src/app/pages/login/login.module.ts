import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
// import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
