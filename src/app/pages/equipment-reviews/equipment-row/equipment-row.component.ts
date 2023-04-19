import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Injector,
} from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { AddReviewComponent } from '../../equipment-reviews-list/add-review/add-review.component';

@Component({
  selector: 'equipment-row',
  templateUrl: './equipment-row.component.html',
  styleUrls: ['./equipment-row.component.scss'],
})
export class EquipmentRowComponent extends BasePage implements OnInit {
  @Input() item;
  @Output('review') review: EventEmitter<any> = new EventEmitter<any>();
  constructor(injector: Injector) {
    super(injector);
  }
  callPusherService() {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {}

  addReview($event) {
    $event.stopPropagation();
    this.review.emit({
      item: this.item,
    });
  }
  async addNew() {
    let res = await this.modals.present(AddReviewComponent);
    let refresh = res.data.refresh;
    console.log(res, 'addNew', refresh);
    if (refresh) this.events.publish('UPDATE_REVIEWS');
  }
}
