import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FriendItemComponent } from './friend-item.component';

@NgModule({
  declarations: [FriendItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [FriendItemComponent],
})
export class FriendItemModule {}
