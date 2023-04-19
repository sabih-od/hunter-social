import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/basic/modal.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
  constructor(public modals: ModalService) {}

  ngOnInit() {}

  close() {
    this.modals.dismiss({ data: 'A' });
  }
}
