import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  _canJoin;

  @Input() set canJoin(value) {
    this._canJoin = value;
  }

  get canJoin() {
    return this._canJoin;
  }
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  action(type) {
    this.popoverController.dismiss({ type });
  }
}
