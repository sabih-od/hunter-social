import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRaceComponent } from './home-race.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [HomeRaceComponent],
  imports: [CommonModule, IonicModule],
  exports: [HomeRaceComponent],
})
export class HomeRaceModule {}
