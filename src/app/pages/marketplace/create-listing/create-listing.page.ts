import { BasePage } from 'src/app/pages/base-page/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  Injector,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.page.html',
  styleUrls: ['./create-listing.page.scss'],
})
export class CreateListingPage extends BasePage implements OnInit {
  aForm: FormGroup;
  userId;
  category_id: any;
  category: any[] = [];
  imageFormControl;
  image_url: any;
  selected: any;
  data: any;
  _img: any;
  user_image;
  user: any = {
    profile_detail: {},
  };
  imagePreview: string;
  picture;
  Upload: any;
  constructor(injector: Injector, public fb: FormBuilder) {
    super(injector);
    this.getUser();
    this.getCategoriess();
  }

  ngOnInit() {
    this.setupForm();
    console.log('image', this.image_url);
    console.log('categrosdsdas', this.data);
  }

  toggleItem(item) {
    item.expanded = !item.expanded;
  }
  async doGetPicture() {
    // return new Promise(async resolve => {
    const _img = await this.image.openCamera();
    console.log(_img);
    if (_img) {
      // this.user_image = _img.base64;
      this.picture = _img;

      // let blob = await this.image.b64toBlob(
      //   _img['base64String'],
      //   'image/' + _img['format']
      // );
      // console.log(blob);
      // this.user["profile_image"] = blob;
      //   const res = await this.imageReceived(blob);
      //   resolve(res);
      // })
    }
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // const base64String = reader.result as string;
      this.picture = reader.result as string;
      // this.imageFormControl.setValue(base64String);
    };
    reader.readAsDataURL(file);
    console.log('dsdsdsdsd', file);
    this.image_url = file;
  }
  // onFileSelected(event): void {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     this.imageUrl = reader.result as string;
  //   };
  // }
  previewImage(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
  }
  async getUser() {
    let user = await this.network.getUser();
    console.log('this.network.getUser', user.data.user.id);
    this.userId = user.data.user.id;
    console.log('dsss', this.userId);
  }
  async getCategoriess() {
    let res = await this.network.getCategoriess(this.data);
    console.log('all categories', res.id);
    res.map((x) => {
      console.log('id', x.id);
      this.category_id = x.id;
    });
    this.category = res;
  }
  onParagraphClick(event: MouseEvent) {
    const paragraphValue = (event.target as HTMLElement).textContent;
    console.log(paragraphValue);
    this.selected = paragraphValue;
  }
  setupForm() {
    this.aForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      description: [
        '',
        Validators.compose([Validators.required]),
      ],
      condition: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])],
      user_id: ['', Validators.compose([Validators.required])],
      category_id: ['', Validators.compose([Validators.required])],
      picture: ['', Validators.compose([Validators.required])],
    });

    console.log('setupForm,', this.aForm.value);
  }

  async post() {
    let blob = (await this.image.base64ToBlob(this.picture)) as string;

    console.log('setupForm,', this.aForm.value);
    let datas = new FormData();

    datas.append('title', this.aForm.value.title);
    datas.append('price', this.aForm.value.price);
    datas.append('description', this.aForm.value.description);
    datas.append('condition', this.aForm.value.condition);
    datas.append('category', this.selected);
    datas.append('images[]', blob);
    datas.append('user_id', this.userId);
    datas.append('category_id', this.category_id);
    datas.append('picture', this.picture);
    // https://testv23.demowebsitelinks.com/hunter_social.com/public/api/marketplace/product/create
    // https://testv23.demowebsitelinks.com/hunter_social.com/public/api/marketplace/product/create

    // this.aForm.value.user_id = this.userId;
    // this.aForm.value.category_id = this.category_id;
    // this.aForm.value.image = this.image_url;
    // this.aForm.value.category = this.selected;
    // this.aForm.value.picture = this.picture

    let data = await this.network.createListing(datas);
    if(data){
      console.log('this is data', data);
      // this.nav.pop();
      this.modals.dismiss({ refresh: true })
    }
  }
}
