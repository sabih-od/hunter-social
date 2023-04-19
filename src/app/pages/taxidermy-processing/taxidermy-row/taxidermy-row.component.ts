import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'taxidermy-row',
  templateUrl: './taxidermy-row.component.html',
  styleUrls: ['./taxidermy-row.component.scss'],
})
export class TaxidermyRowComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
