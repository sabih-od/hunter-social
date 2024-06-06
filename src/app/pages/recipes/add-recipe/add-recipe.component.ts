import { Component, Injector, Input, OnInit } from '@angular/core';
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
  id;

  private _item: any;

  @Input()
  public get item(): any {
    return this._item;
  }

  public set item(value: any) {
    this._item = value;
    this.setFormValues();
  }

  constructor(injector: Injector) {
    super(injector);
    this.setupForm();
  }

  ngOnInit() {}

  setFormValues() {
    setTimeout(() => {
      this.id = this.item.id;
      this.aForm.patchValue({
        name: this.item.name,
        description: this.item.description,
        ingredients: this.item.ingredients,
      });
      // this._image = this.item.image;
    }, 500);
  }

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
        formData.append('image', this._img);
      }
      let res = this.id
        ? await this.network.editRecipe(data, this.id)
        : await this.network.addRecipe(formData);
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

      // if (res) {
      //   const { base64, blob } = res;
      //   this._img = blob;
      //   this._image = base64;
      // }

      // let blob = await this.image.b64toBlob(
      //   _img['base64String'],
      //   'image/' + _img['format']
      // );
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
