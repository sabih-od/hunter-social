import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';

@NgModule({
    declarations: [DisclaimerComponent],
    imports: [CommonModule, IonicModule],
    exports: [DisclaimerComponent],
})
export class DisclaimerModule { }
