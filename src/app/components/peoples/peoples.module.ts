import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PeoplesComponent } from './peoples.component';

@NgModule({
    declarations: [PeoplesComponent],
    imports: [CommonModule, IonicModule],
    exports: [PeoplesComponent],
})
export class PeoplesModule { }
