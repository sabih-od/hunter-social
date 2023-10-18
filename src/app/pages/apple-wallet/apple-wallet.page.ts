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
  product_key;
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

  initialize() {
    this.package_id = this.nav.getQueryParams().package_id;
    console.log('this.package_id', this.package_id);
    this.product_key = this.package_id === '2' ? PRODUCT_GOLD_KEY : PRODUCT_PLATINUM_KEY;
    console.log('this.product_key', this.product_key);

    this.plt.ready().then(() => {
      this.store.verbosity = this.store.DEBUG;

      if (Capacitor.getPlatform() == 'ios') {
        this.registerProducts();
        this.setupListeners();
      }

      // Get the real product information
      this.store.ready(() => {
        this.products.push(this.store.get(this.product_key));
        this.ref.detectChanges();
      });
    });
  }

  ngOnInit() { }

  registerProducts() {
    this.store.register({ id: this.product_key, type: this.store.PAID_SUBSCRIPTION, });
    this.store.refresh();
  }

  setupListeners() {
    if (Capacitor.getPlatform() != 'ios') return;

    this.store.when('product').approved((p: IAPProduct) => {
      console.log(`this.store.when('product').approved`);
      // if (p.id == (this.product_key)) this.updateMemberShipPayment(p.id);
      this.ref.detectChanges();
      return p.verify();
    }).verified((p: IAPProduct) => p.finish());

    this.store.when('product').updated((p: IAPProduct) => {
      if (p.owned && p.id == this.product_key) {
        this.updateMemberShipPayment(p.id);
      }
    })

    this.store.when(this.product_key).owned((p: IAPProduct) => {
      console.log(`this.store.when(PRODUCT_GOLD_KEY).owned`, p);
      // this.updateMemberShipPayment(p.id);
    });

    this.store.when('subscription').approved((p) => {
      console.log(`this.store.when('subscription').approved`, p);
      // if (p.id == (this.product_key)) this.updateMemberShipPayment(p.id);
    });

    this.store.when('subscription').expired(p => console.log('subscription expired'));
    this.store.when('subscription').cancelled(p => console.log('subscription canceled'));
    this.store.when('subscription').finished(p => {
      console.log('subscription finished', p);
      // if (p.id == (this.product_key)) this.updateMemberShipPayment(p.id);
    });
    this.store.when('subscription').error(p => console.log('subscription error', p));

  }
  //
  purchase(product: IAPProduct) {
    this.store.order(product).then(
      (p) => console.log('this.store.order purcahse:', p),
      (e) => this.presentAlert('Failed', `Failed to purchase: ${e}`)
    );
  }

  async updateMemberShipPayment(id) {
    let resee = await this.network.getUser();
    let user = null;
    if (resee?.data?.user) {
      user = resee?.data?.user;
    }
    console.log('getUser', user);

    if (!user) {
      this.utility.presentFailureToast('failed');
      return;
    }

    let { package_id, shouldRedirect } = this.nav.getQueryParams();
    console.log('shouldRedirect => ', shouldRedirect)
    let res = await this.network.updateMemershipPayment(user.email, this.package_id, user.id);
    console.log('updatePackageOnServer', res);

    if (res && res.data) {
      let _res = await this.network.getUser();
      console.log('User', _res);
      if (_res && _res.data && _res.data.user) {

        // alert(JSON.stringify(_res.data.user)); 

        this.users.setUser(_res.data.user);
        console.log('Updating User');
        this.utility.presentSuccessToast('Package updated successfully!');
        this.utility.hideLoader();
        if (shouldRedirect === "false") {
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
