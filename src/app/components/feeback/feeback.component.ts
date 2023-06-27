import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from 'src/app/services/network.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-feeback',
  templateUrl: './feeback.component.html',
  styleUrls: ['./feeback.component.scss'],
})
export class FeebackComponent implements OnInit {

  feedbackForm: FormGroup;
  loading = false;
  constructor(
    public formBuilder: FormBuilder,
    public network: NetworkService,
    public utility: UtilityService) {
      
     }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      comment: ['', Validators.compose([Validators.required, Validators.minLength(10)]),],
    });
  }

  async submitFeedback() {
    if (!this.feedbackForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    const formdata = this.feedbackForm.value;
    this.loading = true;
    let res = await this.network.feedback(this.feedbackForm.value);
    console.log('feedback res => ', res);
    if (res && res.data) {
      this.utility.presentSuccessToast('Feedback sent successfully');
      this.feedbackForm.setValue({ comment: '' })
    }

  }

}
