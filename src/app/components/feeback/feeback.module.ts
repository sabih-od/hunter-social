import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeebackComponent } from './feeback.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FeebackComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    exports: [FeebackComponent],
})
export class FeebackModule { }
