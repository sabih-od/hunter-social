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
    const formdata = this.feedbackForm.value;
    console.log('formdata res => ', this.feedbackForm.controls.comment?.errors?.minlength);
    if (this.feedbackForm.controls.comment?.errors?.required) {
      this.utility.presentFailureToast('Please privde a valid feedback');
      return;
    } 
    if (this.feedbackForm.controls.comment?.errors?.minlength?.actualLength < this.feedbackForm.controls.comment?.errors?.minlength?.requiredLength) {
      this.utility.presentFailureToast('Feedback should contain more than 10 characters');
      return;
    }
    if (!this.feedbackForm.valid) {
      this.utility.presentFailureToast('Pleae fill all fields properly');
      return;
    }

    this.loading = true;
    let res = await this.network.feedback(this.feedbackForm.value);
    console.log('feedback res => ', res);
    if (res && res.data) {
      this.utility.presentSuccessToast('Feedback sent successfully');
      this.feedbackForm.setValue({ comment: '' })
    }

  }

}
