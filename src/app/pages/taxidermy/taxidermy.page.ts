import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-taxidermy',
  templateUrl: './taxidermy.page.html',
  styleUrls: ['./taxidermy.page.scss'],
})
export class TaxidermyPage extends BasePage implements OnInit {
  taxidermyPage = 1;
  processingPage = 1;
  list1;
  list2;
  path = null;
  taxidermyLastPage = -1;
  processingLastPage = -1;
  @ViewChild('content', { static: false }) ionContent: IonContent;
  constructor(injector: Injector) {
    super(injector);
  }

  taxidermies = [];
  taxidermyMapArr = ['wa', 'mt'];
  processing = [];

  ngOnInit() {
    this.getData(null);
    this.init();
  }

  next(type, isAdd) {
    if (type === 'taxidermy') {
      if (isAdd) this.taxidermyPage++;
      else this.taxidermyPage--;
      this.getTexidermy(null);
    } else {
      if (isAdd) this.processingPage++;
      else this.processingPage--;
      this.getProcessing(null);
    }
  }

  getData(state) {
    this.getTexidermy(state);
    this.getProcessing(state);
  }

  async getTexidermy(state) {
    state = this.path ? this.path : state;
    let res = await this.network.getTaxidermy(state, this.taxidermyPage);
    if (res && res.data.data){
      this.taxidermyLastPage = res.data.last_page;
      this.taxidermies = res.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    else{
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }

    if (state) this.scroll();
  }

  async getProcessing(state) {
    state = this.path ? this.path : state;
    let res = await this.network.getProcessing(state, this.processingPage);
    if (res && res.data.data){
      this.processingLastPage = res.data.last_page;
      this.processing = res.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    else{
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    }

  }

  showWebsite(item) {
    this.utility.openExternalUrl(item.website, '_system');
  }

  pathClicked(item) {
    this.taxidermyPage = 1;
  this.processingPage = 1;
    this.getData(item);
  }

  init() {
    this.list1 = this.dataService.getTexidermy1();
    this.list2 = this.dataService.getTexidermy2();
  }

  scroll() {
    this.ionContent.scrollToPoint(0, 1200, 500);
  }
}
