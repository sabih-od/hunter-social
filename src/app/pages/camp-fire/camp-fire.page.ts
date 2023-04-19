import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-camp-fire',
  templateUrl: './camp-fire.page.html',
  styleUrls: ['./camp-fire.page.scss'],
})
export class CampFirePage extends BasePage implements OnInit {
  items;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.items = this.dataService.getCampFires();
  }
}
