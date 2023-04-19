import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HunterBranchesPageRoutingModule } from './hunter-branches-routing.module';

import { HunterBranchesPage } from './hunter-branches.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HunterBranchesPageRoutingModule
  ],
  declarations: [HunterBranchesPage]
})
export class HunterBranchesPageModule {}
