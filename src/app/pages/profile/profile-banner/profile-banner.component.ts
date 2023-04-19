import { Component, Injector, Input, OnInit } from '@angular/core';

import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss'],
})
export class ProfileBannerComponent implements OnInit {
  @Input() isSelf = false;
  constructor() {}

  ngOnInit() {}
}
