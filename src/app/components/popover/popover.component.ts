import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { ReportPage } from 'src/app/pages/report/report.page';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  extends BasePage implements OnInit {
  item: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}



  async openreport() {
    var res = await this.modals.present(ReportPage, {
      tag: 'post',
      // id: this.item.id,
    });
    console.log('ReportComponent');
  }

}
