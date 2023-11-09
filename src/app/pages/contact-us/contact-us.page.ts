import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends BasePage implements OnInit {
  loading = false;
  constructor(injector: Injector) {
    super(injector);
  }

  termsAccepted = false;
  user;
  contactForm: FormGroup;

  ngOnInit() {
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    console.log('this.user => ', this.user)
    this.initializeForm();
  }

  initializeForm() {
    this.contactForm = this.formBuilder.group({
      fname: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(`^[A-Za-z]+$`)
        ]),
      ],
      lname: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(`^[A-Za-z]+$`)
        ]),
      ],
      email: [
        this.user?.email || '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
          // Validators.email
        ]),
      ],
      phone: [
        this.user?.phone || '',
        Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      message: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.required,
        ]),
      ],
    })
  }

  onTermsChecked() {
    this.termsAccepted = !this.termsAccepted;
  }

  async sumit() {
    console.log('this.contactForm.controls => ', this.contactForm.controls)
    if (this.contactForm.controls.fname?.errors?.required) { this.utility.presentFailureToast('First name is required'); return; }
    if (this.contactForm.controls.fname?.errors?.pattern) { this.utility.presentFailureToast('Please provide valid first name'); return; }
    if (this.contactForm.controls.lname?.errors?.required) { this.utility.presentFailureToast('Last name is required'); return; }
    if (this.contactForm.controls.lname?.errors?.pattern) { this.utility.presentFailureToast('Please provide valid last name'); return; }
    if (this.contactForm.controls.email?.errors?.required) { this.utility.presentFailureToast('Email is required'); return; }
    if (this.contactForm.controls.email?.errors?.pattern) { this.utility.presentFailureToast('Please privde a valid email'); return; }
    if (this.contactForm.controls.phone?.errors?.required) { this.utility.presentFailureToast('Please privde a valid phone'); return; }
    if (this.contactForm.controls.message?.errors?.required) { this.utility.presentFailureToast('Please privde a valid message'); return; }
    if (this.contactForm.controls.message?.errors?.minlength.actualLength < this.contactForm.controls.message?.errors?.minlength.requiredLength) { this.utility.presentFailureToast('Message should be atleast 10 characters'); return; }
    // if (this.contactForm.controls.checkAgreement?.errors?.required) {
    //   this.utility.presentFailureToast('Please check terms and conditions');
    //   return;
    // }
    if (!this.contactForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    if (!this.termsAccepted) {
      this.utility.presentFailureToast('Pleae read and accept terms and conditions');
      return;
    }

    const formdata = this.contactForm.value;
    this.loading = true;
    console.log('formdata => ', formdata)

    try {
      let res = await this.network.contactUs(formdata);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.contactForm.setValue({ message: '' })
        // this.nav.pop();
      } else this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
    } catch (err) {
      console.log(err);
      // this.utility.presentFailureToast('Something Went Wrong');
    } finally {
      this.loading = false;
    }

  }
}
