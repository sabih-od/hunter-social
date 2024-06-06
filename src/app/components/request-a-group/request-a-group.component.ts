import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-request-a-group',
  templateUrl: './request-a-group.component.html',
  styleUrls: ['./request-a-group.component.scss'],
})
export class RequestAGroupComponent extends BasePage implements OnInit {

  groups = [];
  requestGroupForm: FormGroup;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getGroups()
    this.requestGroupForm = this.formBuilder.group({
      group_name: ['', Validators.required],
      group_description: ['', Validators.required],
      group_type: ['', Validators.required],
    });
  }

  async getGroups() {
    let res = await this.network.getGroupTypes();
    if (res && res.data) {
    
      // let arr = Object.values(res.data);
      // this.groups = arr;
      this.groups = Object.values(res.data);
    } else {
      this.groups = []
    }
  }



  async onSubmitRequest() {
    if (this.requestGroupForm.invalid) {
      this.utility.presentFailureToast('Please fill all fields properly');
      return;
    }

    let res = await this.network.requestGroup(this.requestGroupForm.value);
    if (res) {
      this.utility.presentSuccessToast('Group request submitted successfully');
      this.modals.dismiss();
    }

  }

  close() {
    this.modals.dismiss();
  }
}
