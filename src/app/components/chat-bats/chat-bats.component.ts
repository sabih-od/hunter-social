import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-chat-bats',
  templateUrl: './chat-bats.component.html',
  styleUrls: ['./chat-bats.component.scss'],
})
export class ChatBatsComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  tab = 'friends';
  _showGroup;

  @Input() set showGroup(val) {
    this.tab = 'groups';
  }

  ngOnInit() {}

  segmentChanged($event) {
    this.tab = $event.target.value;
  }

  close() {
    this.modals.dismiss();
  }
}
