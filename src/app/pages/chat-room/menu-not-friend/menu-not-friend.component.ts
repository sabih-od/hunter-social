import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu-not-friend',
  templateUrl: './menu-not-friend.component.html',
  styleUrls: ['./menu-not-friend.component.scss'],
})
export class MenuNotFriendComponent implements OnInit {
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  action(type) {
    this.popoverController.dismiss({ type });
  }
}
