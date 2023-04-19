import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss'],
})
export class LocatorComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
