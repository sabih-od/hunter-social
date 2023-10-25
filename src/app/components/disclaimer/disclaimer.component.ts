import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
})
export class DisclaimerComponent implements OnInit {

  showmodal = true;

  constructor() { }

  ngOnInit() { }

  hideModal() {
    this.showmodal = false;
  }

}
