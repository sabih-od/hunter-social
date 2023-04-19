import { Component, Inject, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-nationwide-laws',
  templateUrl: './nationwide-laws.page.html',
  styleUrls: ['./nationwide-laws.page.scss'],
})
export class NationwideLawsPage extends BasePage implements OnInit {
  laws;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.laws = this.dataService.getNationwideLaws();
  }
}
