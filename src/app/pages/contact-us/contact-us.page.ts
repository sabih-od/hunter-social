import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends BasePage implements OnInit {
  fname;
  lname;
  email;
  phoneNumber;
  message;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  async sumit() {
    let data = {
      email: this.email,
      fname: this.fname,
      lname: this.lname,
      phone: this.phoneNumber,
      message: this.message,
    };
    let res = await this.network.contactUs(data);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.nav.pop();
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }
}
