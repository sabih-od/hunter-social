import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'right-row',
  templateUrl: './right-row.component.html',
  styleUrls: ['./right-row.component.scss'],
})
export class RightRowComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
