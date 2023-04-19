import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss'],
})
export class LawsComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
