import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowToPageRoutingModule } from './how-to-routing.module';

import { HowToPage } from './how-to.page';
import { HowToBannerComponent } from './how-to-banner/how-to-banner.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { HowToCardsComponent } from './how-to-cards/how-to-cards.component';
import { CardSubmissionComponent } from './card-submission/card-submission.component';
import { ChatFloatingButtonModule } from 'src/app/components/chat-floating-button/chat-floating-button.module';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CustomFilterPipe } from 'src/app/pipes/custom-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowToPageRoutingModule,
    FooterModule,
    HeaderModule,
    ChatFloatingButtonModule,
    // Ng2SearchPipeModule,
  ],
  declarations: [
    HowToPage,
    HowToBannerComponent,
    HowToCardsComponent,
    CardSubmissionComponent,
    CustomFilterPipe
  ],
})
export class HowToPageModule {}
