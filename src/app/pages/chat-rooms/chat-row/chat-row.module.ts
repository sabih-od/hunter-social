import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChatRowComponent } from './chat-row.component';

@NgModule({
  declarations: [ChatRowComponent],
  imports: [CommonModule, IonicModule],
  exports: [ChatRowComponent],
})
export class ChatRowModule {}
