import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-news',
  templateUrl: './home-news.component.html',
  styleUrls: ['./home-news.component.scss'],
})
export class HomeNewsComponent implements OnInit {
  @Input() news;
  constructor() {}

  ngOnInit() {}
}
