import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading: HTMLIonLoadingElement;
  static loadings: HTMLIonLoadingElement[] = [];
  constructor(private loadingController: LoadingController) {}

  async show() {
    this.showLoader();
  }

  async hide() {
    this.hideLoader();
  }

  async showLoader(message = 'Please wait...') {
    if (this.loading) {
      this.loading.dismiss();
    }

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message,
    });
    LoadingService.loadings.push(this.loading);
    await this.loading.present();
  }

  async hideLoader() {
    LoadingService.loadings.forEach((x) => {
      x?.dismiss({ data: 'A' });
    });

    //LoadingService.loadings = [];
  }
}
