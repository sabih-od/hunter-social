import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import {
  IAPProduct,
  InAppPurchase2,
} from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { PLAN_TYPE } from 'src/app/data/const/enums';
import { Router } from '@angular/router';
// "cordova-plugin-purchase
const PRODUCT_GOLD_KEY = 'com.hunterssocial.app.gold_package_n1';
const PRODUCT_PLATINUM_KEY = 'com.hunterssocial.app.platinum_package_n1';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

// const PRODUCT_GOLD_KEY = 'com.hunterssocial.app.gold_package_n2';
// const PRODUCT_PLATINIUM_KEY = 'devpro';
// shoaibuddin12fx@gmail.com
// HOTm@!l12VU
// two problem
//problem no 1 delete this page after moving away from it
//problem no 2 on back user was already created
@Component({
  selector: 'app-apple-wallet',
  templateUrl: './apple-wallet.page.html',
  styleUrls: ['./apple-wallet.page.scss'],
})
export class AppleWalletPage extends BasePage implements OnInit {
  products: IAPProduct[] = [];
  isPro = 'false';
  package_id: String = '';
  isColorChangeNeeded: boolean = true;
  constructor(
    private plt: Platform,
    private store: InAppPurchase2,
    private alertController: AlertController,
    private ref: ChangeDetectorRef,
    public router: Router,
    injector: Injector
  ) {
    super(injector);
    this.initialize();
  }

  ionViewWillEnter() {
    // this.initialize();
  }

  async gotoPrivacy() {
    await Browser.open({ url: `https://hunterssocial.com/privacy` });
  }

  async gotoTerms() {
    await Browser.open({ url: `https://hunterssocial.com/terms` });
  }

  initialize() {
    this.package_id = this.nav.getQueryParams().package_id;
    console.log('this.package_id', this.package_id);

    if (Number(this.package_id) == 2) {
      const item1: IAPProduct = {
        id: 'com.hunterssocial.app.gold_package_n1',
        title: 'Gold',
        description:
          'Hunter social has dating feature that is available for gold subscriber Dating feature is only available for paid members of gold package Here we attach the screen shot of the screen where we can purchase gold subscription in 9.99 dollars',
        price: '9.99',
        currency: 'USD',
        finish: function (): void {
          // throw new Error('Function not implemented.');
          return;
        },
        verify: function () {
          // throw new Error('Function not implemented.');
          return;
        },
        set: function (key: string, value: any): void {
          // throw new Error('Function not implemented.');
          return;
        },
        stateChanged: function (): void {
          // throw new Error('Function not implemented.');
          return;
        },
        on: function (event: string, callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        once: function (event: string, callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        off: function (callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        trigger: function (action: string, args: any): void {
          // throw new Error('Function not implemented.');
          return;
        },
        type: '',
        state: '',
        priceMicros: 0,
        loaded: false,
        valid: false,
        canPurchase: false,
        owned: false,
      };

      this.products.push(item1);
    }

    if (Number(this.package_id) == 3) {
      const item2: IAPProduct = {
        id: `https://hunterssocial.com/terms`,
        title: 'Platinum',
        description:
          'Hunter social has dating feature, group features and group messaging features that is available for platinum subscriber Dating feature is also available for paid members of platinum package Here we attach the screen shot of the screen where we can purchase platinum subscription in 31.95 dollars.',
        price: '31.95',
        currency: 'USD',
        finish: function (): void {
          // throw new Error('Function not implemented.');
          return;
        },
        verify: function () {
          // throw new Error('Function not implemented.');
          return;
        },
        set: function (key: string, value: any): void {
          // throw new Error('Function not implemented.');
          return;
        },
        stateChanged: function (): void {
          // throw new Error('Function not implemented.');
          return;
        },
        on: function (event: string, callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        once: function (event: string, callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        off: function (callback: Function): void {
          // throw new Error('Function not implemented.');
          return;
        },
        trigger: function (action: string, args: any): void {
          // throw new Error('Function not implemented.');
          return;
        },
        type: '',
        state: '',
        priceMicros: 0,
        loaded: false,
        valid: false,
        canPurchase: false,
        owned: false,
      };

      this.products.push(item2);
    }

    console.log(this.nav.getQueryParams());
    this.plt.ready().then(() => {
      // Only for debugging!
      this.store.verbosity = this.store.DEBUG;

      if (Capacitor.getPlatform() != 'ios') {
        this.registerProducts();
        this.setupListeners();
      }

      // Get the real product information
      this.store.ready(() => {
        let G;
        let P;
        if (this.package_id === '2') {
          G = this.store.get(PRODUCT_GOLD_KEY);
        } else if (this.package_id === '3') {
          P = this.store.get(PRODUCT_PLATINUM_KEY);
        }

        console.log('GOLD: ', G, this.package_id);
        if (G) {
          const x1 = this.products.findIndex((x) => x.id == G.id);
          if (x1 == -1) {
            this.products.push(G);
          }
        }
        console.log('PLATINUM: ', P, this.package_id);
        if (P) {
          const x2 = this.products.findIndex((x) => x.id == P.id);
          if (x2 == -1) {
            this.products.push(P);
          }
        }
        this.ref.detectChanges();
      });
    });
  }

  ngOnInit() {}

  registerProducts() {
    if (this.package_id === '2') {
      this.store.register({
        id: PRODUCT_GOLD_KEY,
        type: this.store.PAID_SUBSCRIPTION,
      });
    } else if (this.package_id === '3') {
      this.store.register({
        id: PRODUCT_PLATINUM_KEY,
        type: this.store.PAID_SUBSCRIPTION,
      });
    }
    this.store.refresh();
  }

  setupListeners() {
    console.log(this.platform.is('ios'));
    if (Capacitor.getPlatform() != 'ios') {
      return;
    }
    // General query to all products
    this.store
      .when('product')
      .approved((p: IAPProduct) => {
        // Handle the product deliverable
        console.log(p);
        if (p.id === PRODUCT_GOLD_KEY || p.id === PRODUCT_PLATINUM_KEY) {
          this.isPro = 'true  fdsafsd';
        }
        this.ref.detectChanges();

        return p.verify();
      })
      .verified((p: IAPProduct) => {
        console.log('finished', p);
        this.updateMemberShipPayment(p.id);
        p.finish();
      });

    // Specific query for one ID
    if (this.package_id === '2') {
      this.store.when(PRODUCT_GOLD_KEY).owned((p: IAPProduct) => {
        // this.isPro = true;
        console.log('p owned');
        this.utility.presentSuccessToast('Product Purchased set');

        this.nav.push('pages/home');
      });
    } else if (this.package_id === '3') {
      this.store.when(PRODUCT_PLATINUM_KEY).owned((p: IAPProduct) => {
        // this.isPro = true;
        console.log('p owned');
        this.utility.presentSuccessToast('Product Purchased set');
        this.updateMemberShipPayment(p.id);

        // this.nav.push('pages/home');
      });
    }

    this.store.when('subscription').approved((p) => {
      console.log(p);
    });
  }
  //
  purchase(product: IAPProduct) {
    this.store.order(product).then(
      (p) => {
        // Purchase in progress!
        console.log('purcahse:', p);

        this.utility.presentSuccessToast('Product Initiated');
        this.updateMemberShipPayment(product.id);

        this.nav.push('pages/home');
      },
      (e) => {
        this.presentAlert('Failed', `Failed to purchase: ${e}`);
      }
    );
  }

  async updateMemberShipPayment(id) {
    let user = await this.users.getUser();
    let { package_id, shouldRedirect } = this.nav.getQueryParams();
    let res = await this.network.updateMemershipPayment(
      user.email,
      package_id,
      id
    );
    console.log('updatePackageOnServer', res);
    if (res && res.data) {
      let _res = await this.network.getUser();
      console.log('User', _res);
      if (_res && _res.data && _res.data.user) {
        this.users.setUser(_res.data.user);
        console.log('Updating User');
        this.utility.presentSuccessToast('Package updated successfully!');
        this.utility.hideLoader();
        if (!shouldRedirect) {
          this.nav.pop();
        } else {
          // this.nav.push('pages/home');
          this.router.navigate(['pages/home'], { replaceUrl: true });
          this.events.publish('USER_DATA_RECEIVED');
          this.events.publish('ROUTE_CHANGED');
          this.menuCtrl.enable(true, 'main');
        }
      } else {
        this.utility.hideLoader();
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
      }
    } else {
      this.utility.hideLoader();
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
