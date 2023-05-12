import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage extends BasePage implements OnInit {


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }
  async goBack() {
    let isModalExist = await this.modals.isModalOpen();
    if (isModalExist) this.modals.dismiss({});
    else this.nav.pop();
  }
}
