import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lure-item',
  templateUrl: './lure-item.component.html',
  styleUrls: ['./lure-item.component.scss'],
})
export class LureItemComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
