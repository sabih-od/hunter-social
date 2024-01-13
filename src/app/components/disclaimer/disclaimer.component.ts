import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/basic/events.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
})
export class DisclaimerComponent implements OnInit {

  showmodal = true;

  constructor(
    public eventService: EventsService,
  ) { }

  ngOnInit() { }

  hideModal() {
    this.eventService.publish('DISCLAIMER_CLOSED');
    this.showmodal = false;
  }

}
