import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public modal: ModalController) {}

  present(component, data = {}, cssClass = ''): Promise<any> {
    return new Promise(async (resolve) => {
      const modal = await this.modal.create({
        component,
        cssClass,
        componentProps: data,
      });
      modal.onDidDismiss().then((res) => {
        resolve(res);
      });
      await modal.present();
    });
  }

  dismiss(data: any = {}): Promise<any> {
    return new Promise((resolve) => {
      data.dismiss = true;
      this.modal.dismiss(data).then((v) => resolve(true));
    });
  }

  isModalOpen() {
    return new Promise<boolean>(async (resolve) => {
      let modal = await this.modal?.getTop();
      console.log(modal);
      resolve(modal !== null && modal !== undefined);
    });
  }
}
