import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'outfitter',
  templateUrl: './outfitter.component.html',
  styleUrls: ['./outfitter.component.scss'],
})
export class OutfitterComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
