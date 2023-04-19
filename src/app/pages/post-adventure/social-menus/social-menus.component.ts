import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-social-menus',
  templateUrl: './social-menus.component.html',
  styleUrls: ['./social-menus.component.scss'],
})
export class SocialMenusComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  action(type) {
    this.popoverController.dismiss({ type });
  }
}
