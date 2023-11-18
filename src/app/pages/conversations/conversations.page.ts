import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage extends BasePage implements OnInit {

  // constructor() { }

  // ngOnInit() {
  // }

  constructor(injector: Injector) {
    super(injector);
  }

  tab = 'friends';
  _showGroup;

  @Input() set showGroup(val) {
    this.tab = 'groups';
  }

  ngOnInit() { }

  segmentChanged($event) {
    this.tab = $event.target.value;
  }

  close() {
    this.modals.dismiss();
  }

}
