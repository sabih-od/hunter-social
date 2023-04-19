import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'store-row',
  templateUrl: './store-row.component.html',
  styleUrls: ['./store-row.component.scss'],
})
export class StoreRowComponent implements OnInit {
  @Input() item;
  @Output('updateQty') updateQty: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {
    console.log(this.item);
  }

  add() {
    console.log('add works');
    this.updateQty.emit({ key: 'add', item: this.item });
  }
  sub() {
    this.updateQty.emit({ key: 'sub', item: this.item });
  }

  remove() {
    this.updateQty.emit({ key: 'remove', item: this.item });
  }
}
