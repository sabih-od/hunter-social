import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-race',
  templateUrl: './home-race.component.html',
  styleUrls: ['./home-race.component.scss'],
})
export class HomeRaceComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
