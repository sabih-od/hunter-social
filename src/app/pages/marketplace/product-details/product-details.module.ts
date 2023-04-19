import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { HeaderModule } from 'src/app/components/header/header.module';



@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,HeaderModule,IonicModule
  ],exports:[ProductDetailsComponent]
})
export class ProductDetailsModule { }
HeaderModule
