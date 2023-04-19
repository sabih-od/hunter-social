import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  free_features;
  gold_features;
  platinum_features;
  constructor() {}

  ngOnInit() {
    this.free_features = ['Home', 'Chat Room', 'Store', 'Profile'];
    this.gold_features = [
      'Home',
      'Locators',
      'Chat Room',
      'Recipe',
      'Store',
      'Profile',
      'How To',
      'Equipment Reviews',
    ];
    this.platinum_features = [
      'Home',
      'Locators',
      'Chat Room',
      'Recipe',
      'Store',
      'Profile',
      'How To',
      'Equipment Reviews',
      'Dating',
    ];
  }
}
