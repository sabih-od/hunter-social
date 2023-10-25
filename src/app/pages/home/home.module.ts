import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { PromotionsModule } from 'src/app/components/promotions/promotions.module';
import { HomeNewsModule } from './home-news/home-news.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { HomeRaceModule } from './home-race/home-race.module';
import { LocatorModule } from '../../components/locator/locator.module';
import { DatingModule } from './dating/dating.module';
import { LawsModule } from './laws/laws.module';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { HuntersComponent } from './hunters/hunters.component';
import { ImagesComponent } from './images/images.component';
import { LogosComponent } from './logos/logos.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { RecipeBannerComponent } from '../recipes/recipe-banner/recipe-banner.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { NewsLetterComponent } from './news-letter/news-letter.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { AppSearchModule } from 'src/app/components/app-search/app-search.module';
import { ChatFloatingButtonComponent } from 'src/app/components/chat-floating-button/chat-floating-button.component';
import { DisclaimerComponent } from 'src/app/components/disclaimer/disclaimer.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PromotionsModule,
    HomeNewsModule,
    HomeRaceModule,
    HeaderModule,
    LocatorModule,
    DatingModule,
    LawsModule,
    ChatFloatingButtonModule,
    FooterModule,
  ],
  declarations: [
    HomePage,
    AboutUsComponent,
    HuntersComponent,
    ImagesComponent,
    LogosComponent,
    HomeBannerComponent,
    ReviewsComponent,
    NewsLetterComponent,
    ChatFloatingButtonComponent,
    DisclaimerComponent
  ],
})
export class HomePageModule {}
