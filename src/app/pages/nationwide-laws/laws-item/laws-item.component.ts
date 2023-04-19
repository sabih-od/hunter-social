import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'laws-item',
  templateUrl: './laws-item.component.html',
  styleUrls: ['./laws-item.component.scss'],
})
export class LawsItemComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
