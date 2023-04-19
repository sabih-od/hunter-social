import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
