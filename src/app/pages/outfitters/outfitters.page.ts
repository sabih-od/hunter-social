import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-outfitters',
  templateUrl: './outfitters.page.html',
  styleUrls: ['./outfitters.page.scss'],
})
export class OutfittersPage extends BasePage implements OnInit {
  items;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.items = this.dataService.getOutfitters();
  }
  pathClicked(item) {
    // this.getData(item);
  }

}
