import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-tie-a-lure',
  templateUrl: './tie-a-lure.page.html',
  styleUrls: ['./tie-a-lure.page.scss'],
})
export class TieALurePage extends BasePage implements OnInit {
  items;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.items = this.dataService.getTieATure();
  }
}
