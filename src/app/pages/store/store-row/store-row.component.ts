import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'store-row',
  templateUrl: './store-row.component.html',
  styleUrls: ['./store-row.component.scss'],
})
export class StoreRowComponent implements OnInit {
  @Input() item;
  constructor() {
    console.log('item', this.item);
  }

  ngOnInit() {}
}
