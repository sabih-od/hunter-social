import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../../base-page/base-page';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'news-letter',
  templateUrl: './news-letter.component.html',
  styleUrls: ['./news-letter.component.scss'],
})
export class NewsLetterComponent extends BasePage implements OnInit {
  email;
  subs = false;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  async subscribeNewsletter() {
    this.network.subscribeNewsletter({ email: this.email }).then((e) => {
      this.utility.presentSuccessToast('Successfully Subscribed');
      console.log(e);

      if (e.error) {
        this.subs = false;
      } else {
        this.subs = true;
      }
    });
  }
}
