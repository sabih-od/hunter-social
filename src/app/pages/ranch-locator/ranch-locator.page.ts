import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-ranch-locator',
  templateUrl: './ranch-locator.page.html',
  styleUrls: ['./ranch-locator.page.scss'],
})
export class RanchLocatorPage extends BasePage implements OnInit {
  ranches = [];
  hunting_guides = [];
  ranchPage = 1;
  huntingPage = 1;
  processingPage = 1;
  path = null;
  ranchLastPage = -1;
  huntingLastPage = -1;
  @ViewChild('content', { static: false }) ionContent: IonContent;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getData(null);
  }

  navigate(arg) {
    //arg == chat
    if (arg === 'shot') this.nav.push('pages/post-adventure');
  }

  async getRanches(state) {
    state = this.path ? this.path : state;
    console.log(this.ranchPage)
    let res = await this.network.getRanches(state, this.ranchPage);
    console.log('getRanches', res.data.data);
    if (res && res.data.data) {
      this.ranchLastPage = res.data.last_page;
      // if (!state) this.ranches = res.data.data;
      // else {
      this.ranches = res.data.data.sort((a, b) => a.name.localeCompare(b.name));
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  async getData(state) {
    this.getRanches(state);
    this.getHuntings(state);
  }

  async getHuntings(state) {
    state = this.path ? this.path : state;
    let hunting_guides = await this.network.getProfessionalHunting(
      state,
      this.huntingPage
    );
    console.log('getRanches', hunting_guides.data.data);
    if (hunting_guides && hunting_guides.data.data) {
      this.huntingLastPage = hunting_guides.data.last_page;
      // if (!state) this.hunting_guides = hunting_guides.data.data;
      // else
      this.hunting_guides = hunting_guides.data.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else
      this.utility.presentFailureToast(
        hunting_guides?.message ?? 'Something went wrong'
      );
    if (state) this.scroll();
  }

  next(type, isAdd) {
    if (type === 'ranch') {
      if (isAdd) this.ranchPage++;
      else this.ranchPage--;
      this.getRanches(null);
    } else {
      if (isAdd) this.huntingPage++;
      else this.huntingPage--;
      this.getHuntings(null);
    }
  }

  showWebsite(item) {
    this.utility.openExternalUrl(item.website, '_system');
  }

  pathClicked(item) {
    console.log(item);
    this.ranchPage = 1;
    this.huntingPage = 1;
    this.ranchLastPage = -1;
    this.huntingLastPage = -1;
    this.path = item;
    this.getData(item);
  }

  scroll() {
    this.ionContent.scrollToPoint(0, 1200, 500);
  }
}
