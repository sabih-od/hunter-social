import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.scss'],
})
export class ImageViewerModalComponent extends BasePage implements OnInit {

  @Input() index: any = '';
  @Input() images: any;

  constructor(Injector: Injector) {
    super(Injector);
  }

  slideImages = []

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  ngOnInit() {
    console.log('index => ', this.index);
    console.log('images => ', this.images);

    this.slideImages = this.images.map(item => item.original_url);
    console.log('this.slideImages => ', this.slideImages);

  }

  closeModal() {
    this.modals.dismiss();
  }

}