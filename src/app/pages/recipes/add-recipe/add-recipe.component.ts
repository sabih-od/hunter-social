import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BasePage } from '../../base-page/base-page';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent extends BasePage implements OnInit {
  aForm: FormGroup;
  _img;
  _image;
  constructor(injector: Injector) {
    super(injector);
    this.setupForm();
  }

  ngOnInit() {}

  setupForm() {
    this.aForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
      ingredients: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });
    console.log('setupForm,');
  }
  async addRecipe() {
    if (!this.aForm.valid) {
      this.utility.presentFailureToast('Please fill all fields');
    } else {
      let data = this.aForm.value;
      let formData = new FormData();
      formData.append('name', this.getValue('name'));
      formData.append('ingredients', this.getValue('ingredients'));
      formData.append('description', this.getValue('description'));
      //
      if (this._img) {
        // let blob = await this.image.b64toBlob(
        //   this._img['base64String'],
        //   'image/' + this._img['format']
        // );
        // console.log(blob);
        formData.append('image', this._img);
      }
      let res = await this.network.addRecipe(formData);
      console.log('AddRecipe', res);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.modals.dismiss({ success: true });
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }

  async doGetPicture() {
    return new Promise(async (resolve) => {
      let resa = await this.image.openCapCamera();
      // console.log('res ->', res);

      // if (res) {
      //   const { base64, blob } = res;
      //   this._img = blob;
      //   this._image = base64;
      // }

      // let blob = await this.image.b64toBlob(
      //   _img['base64String'],
      //   'image/' + _img['format']
      // );
      // console.log(res);
      this._img = resa;
      this._image = resa;
      // const res = await this.imageReceived(blob);
      resolve(resa);
    });
  }

  getValue(val) {
    return this.aForm.get(val).value;
  }

  close() {
    this.modals.dismiss();
  }
}
