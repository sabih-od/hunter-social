import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecipeComponent } from './recipe.component';
import { IngredientModule } from '../ingredient/ingredient.module';

@NgModule({
  declarations: [RecipeComponent],
  imports: [CommonModule, IonicModule, IngredientModule],
  exports: [RecipeComponent],
})
export class RecipeModule {}
