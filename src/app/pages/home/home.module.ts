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
// import { ChatFloatingButtonComponent } from 'src/app/components/chat-floating-button/chat-floating-button.component';
// import { DisclaimerComponent } from 'src/app/components/disclaimer/disclaimer.component';
import { DisclaimerModule } from 'src/app/components/disclaimer/disclaimer.module';
import { CommentsComponent } from '../post-adventure/comments/comments.component';
import { MenusComponent } from '../post-adventure/menus/menus.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AdventureItemModule } from '../post-adventure/adventure-item/adventure-item.module';
import { CreateAdventureComponent } from 'src/app/components/create-adventure/create-adventure.component';
import { PeopleYouMayKnowComponent } from 'src/app/components/people-you-may-know/people-you-may-know.component';
import { DatingItemComponent } from '../dating/dating-item/dating-item.component';
import { FriendItemComponent } from '../dating/friend-item/friend-item.component';
import { StoriesAvatarSliderComponent } from 'src/app/components/stories-avatar-slider/stories-avatar-slider.component';
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
    Ng2SearchPipeModule,
    AdventureItemModule,
    DisclaimerModule
  ],
  declarations: [
    HomePage,
    CreateAdventureComponent,
    PeopleYouMayKnowComponent,
    FriendItemComponent,
    StoriesAvatarSliderComponent,
    // AboutUsComponent,
    // HuntersComponent,
    // ImagesComponent,
    // LogosComponent,
    // HomeBannerComponent,
    // ReviewsComponent,
    // NewsLetterComponent,
    // ChatFloatingButtonComponent,
    // DisclaimerComponent,

    CommentsComponent,
    MenusComponent,
  ],
})
export class HomePageModule { }
