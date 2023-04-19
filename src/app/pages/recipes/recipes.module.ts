import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RecipeBannerComponent } from './recipe-banner/recipe-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule,
    HeaderModule,
    RecipeModule,
    ChatFloatingButtonModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    FooterModule,
    QuillModule.forRoot(),
    //   modules: {
    //     syntax: true,
    //     toolbar: [
    //       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    //       ['blockquote', 'code-block'],

    //       [{ header: 1 }, { header: 2 }], // custom button values
    //       [{ list: 'ordered' }, { list: 'bullet' }],
    //       [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //       [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //       [{ direction: 'rtl' }], // text direction

    //       [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    //       [{ header: [1, 2, 3, 4, 5, 6, false] }],

    //       [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //       [{ font: [] }],
    //       [{ align: [] }],

    //       ['clean'], // remove formatting button

    //       ['link', 'image', 'video'], // link and image, video
    //     ],
    //   },
    // }),
  ],
  declarations: [RecipesPage, AddRecipeComponent, RecipeBannerComponent],
})
export class RecipesPageModule {}
