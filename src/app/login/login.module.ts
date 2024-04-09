import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { FooterModule } from 'src/app/components/footer/footer.module';
// import { FeebackComponent } from './../../components/feeback/feeback.component';
import { FeebackModule } from 'src/app/components/feeback/feeback.module';
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
    FeebackModule,
  ],
  declarations: [
    // FeebackComponent, 
    LoginPage],
})
export class LoginPageModule {}
