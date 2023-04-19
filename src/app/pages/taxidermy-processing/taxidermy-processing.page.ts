import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-taxidermy-processing',
  templateUrl: './taxidermy-processing.page.html',
  styleUrls: ['./taxidermy-processing.page.scss'],
})
export class TaxidermyProcessingPage extends BasePage implements OnInit {
  list1;
  list2;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.list1 = this.dataService.getTexidermy1();
    this.list2 = this.dataService.getTexidermy2();
  }
}
