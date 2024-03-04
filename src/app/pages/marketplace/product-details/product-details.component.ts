import { BasePage } from 'src/app/pages/base-page/base-page';
import { Component, OnInit, Input, Injector } from '@angular/core';
import { ImageViewerModalComponent } from 'src/app/components/image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent extends BasePage implements OnInit {
  @Input() data: any;
  isMark = true;
  user_id: any;
  product_id: any;
  userID: any;

  constructor(Injector: Injector) {
    super(Injector);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  async ngOnInit() {
    this.user_id = JSON.parse(await this.storage.get('user')).id;
    console.log('product data => ', this.data);

    if (this.data) {
      this.isMark = this.data.is_sold == 0 ? false : true;
      console.log('this.isMark => ', this.isMark)
      const proimage = this.image.getImageUrl(this.data?.user?.profile_image);
      this.data.user.profile_image = proimage;
    }

  }

  async openImageViewer(index, images) {
    let res = await this.modals.present(ImageViewerModalComponent, { index, images });
    // const modal = await this.modals.create({
    //   component: ImageViewerModalComponent,
    //   componentProps: {
    //     items: this.imageUrls,
    //     initialSlide: index,
    //   },
    // });
    // await modal.present();
  }

  async mark(productid) {
    let res = await this.network.markAsSold(productid);
    console.log('mark res => ', res.data)
    if (res) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
      this.modals.dismiss({ refresh: true })
    }
    console.log('res', res);
  }

  async opentosell(productid) {
    let res = await this.network.openToSell(productid);
    console.log('opentosell res => ', res.data)
    if (res && !Array.isArray(res.data)) {
      this.utility.presentSuccessToast(res.message);
      this.isMark = !this.isMark;
      this.modals.dismiss({ refresh: true })
    }
    console.log('res', res);

  }


}
