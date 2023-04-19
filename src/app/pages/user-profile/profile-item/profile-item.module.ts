import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileItemComponent } from './profile-item.component';

@NgModule({
  declarations: [ProfileItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [ProfileItemComponent],
})
export class ProfileItemModule {}
