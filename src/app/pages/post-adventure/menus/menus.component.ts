import { Component, Injector, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
})
export class MenusComponent extends BasePage implements OnInit {
  constructor(injector: Injector, public popoverController: PopoverController) {
    super(injector);
  }

  ngOnInit() {}

  action(type) {
    this.popoverController.dismiss({ type });
  }
}
