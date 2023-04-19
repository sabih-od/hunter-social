import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit {
  @Input() item;
  constructor() {}

  ngOnInit() {}
}
