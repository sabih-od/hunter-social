import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'left-row',
  templateUrl: './left-row.component.html',
  styleUrls: ['./left-row.component.scss'],
})
export class LeftRowComponent implements OnInit {
  @Input() item;
  constructor() {}
  ngOnInit() {}
}
