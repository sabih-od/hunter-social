import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dating',
  templateUrl: './dating.component.html',
  styleUrls: ['./dating.component.scss'],
})
export class DatingComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
