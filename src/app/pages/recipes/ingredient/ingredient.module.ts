import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IngredientComponent } from './ingredient.component';

@NgModule({
  declarations: [IngredientComponent],
  imports: [CommonModule, IonicModule],
  exports: [IngredientComponent],
})
export class IngredientModule {}
