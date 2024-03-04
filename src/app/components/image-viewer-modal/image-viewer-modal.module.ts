import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageViewerModalComponent } from './image-viewer-modal.component';

@NgModule({
    declarations: [ImageViewerModalComponent],
    imports: [CommonModule, IonicModule],
    exports: [ImageViewerModalComponent],
})
export class ImageViewerModalModule { }
