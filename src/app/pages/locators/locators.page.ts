import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-locators',
  templateUrl: './locators.page.html',
  styleUrls: ['./locators.page.scss'],
})
export class LocatorsPage implements OnInit {
  guideLocators = [];
  constructor() {}

  ngOnInit() {
    for (var i = 1; i <= 18; i++) {
      this.guideLocators.push({
        image: `assets/images/hbt${i}.png`,
      });
    }
  }
}
