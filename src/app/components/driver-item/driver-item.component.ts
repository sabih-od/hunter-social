import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-driver-item',
  templateUrl: './driver-item.component.html',
  styleUrls: ['./driver-item.component.scss'],
})
export class DriverItemComponent extends BasePage implements OnInit {
  _item;

  @Input() set item(val) {
    let __item = this.dataService.getDriverById(val.driver_id);
    this._item = __item;
  }

  get item() {
    return this._item;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}
}
