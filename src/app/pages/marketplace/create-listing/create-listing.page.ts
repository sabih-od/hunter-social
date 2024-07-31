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
import { Camera, CameraResultType } from '@capacitor/camera';

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
  states: [];
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
  }

  toggleItem(item) {
    item.expanded = !item.expanded;
  }

  pickedImages = [];
  blobImages = [];
  blob;
  async doGetPicture() {
    const images = await Camera.pickImages({
      quality: 90,
      limit: 6
    });

    if (images && images.photos) {
      this.pickedImages = images.photos;
      // const imageData = this.pickedImages[0];
      // let datasrc = await this.image.readFilePath(imageData.path);
      // this.blob = await this.image.base64ToBlob('data:image/png;base64,' + datasrc)
      // let blob = await res.blob();
      // let reader: FileReader = new FileReader();
      // reader.onloadend = (fileLoadedEvent: any) => {
      //   let imgSrcData = fileLoadedEvent.target.result;
      // }
      // reader.readAsDataURL(blob);
    }
    // this.pickedImages.map(async (item) => {
    //   const newimage = await this.convertImagePathToBlob(item.path);
    //   this.blobImages.push(newimage);

    // });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)


    // // return new Promise(async resolve => {
    // const _img = await this.image.openCamera();
    // if (_img) {
    //   // this.user_image = _img.base64;
    //   this.picture = _img;

    //   // let blob = await this.image.b64toBlob(
    //   //   _img['base64String'],
    //   //   'image/' + _img['format']
    //   // );
    //   // this.user["profile_image"] = blob;
    //   //   const res = await this.imageReceived(blob);
    //   //   resolve(res);
    //   // })
    // }
  }

  // isFileTypeAllowed(filePath: string): boolean {
  //   const allowedFileTypes = ['.jpeg', '.png', '.jpg', '.gif'];
  //   const fileType = filePath.toLowerCase().substr(filePath.lastIndexOf('.'));

  //   return allowedFileTypes.includes(fileType);
  // }


  removeimage(ind) {
    this.pickedImages = this.pickedImages.filter((item, index) => ind != index);
  }


  // removeimage(ind) {
  //   this.pickedImages = this.pickedImages.filter((item, index) => ind != index);
  // }

  // changeCategory(value) {
  //   const selectedCategory = this.category.find(cat => cat.name === value);
  //   if (selectedCategory) {
  //     this.category_id = selectedCategory.id;
  //     this.aForm.patchValue({ category_id: selectedCategory.id });
  //   }
  // }

  isFileTypeAllowed(filePath: string): boolean {
    const allowedFileTypes = ['.jpeg', '.png', '.jpg', '.gif'];
    const fileType = filePath.toLowerCase().substr(filePath.lastIndexOf('.'));

    return allowedFileTypes.includes(fileType);
  }


  // removeimage(ind) {
  //   this.pickedImages = this.pickedImages.filter((item, index) => ind != index);
  // }

  changeCategory(value) {
    const selectedCategory = this.category.find(cat => cat.name === value);
    if (selectedCategory) {
      this.category_id = selectedCategory.id;
      this.aForm.patchValue({ category_id: selectedCategory.id });
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
    this.userId = user.data.user.id;


    this.getStates();

  }

  async getStates() {
    let res = await this.network.getStates();
    this.states = res.data;
  }

  async getCategoriess() {
    let res = await this.network.getCategoriess(this.data);
    // Set category to the response, and initialize category_id
    if (res.length > 0) {
      this.category_id = res[0].id;
    }
    this.category = res;
  }
  
  onParagraphClick(event: MouseEvent) {
    const paragraphValue = (event.target as HTMLElement).textContent;
    this.selected = paragraphValue;
  }
  setupForm() {
    this.aForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required]),],
      condition: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      state_id: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])],
      user_id: ['', Validators.compose([Validators.required])],
      category_id: ['', Validators.compose([Validators.required])],
      picture: ['', Validators.compose([Validators.required])],
    });
    this.aForm.get('category').valueChanges.subscribe(value => {
      this.changeCategory(value);
    });
  
  }



  async post() {
    // const newblog = await this.image.base64ToBlob(this.picture)
    // let blob = (newblog) as string;


    let datas = new FormData();

    datas.append('title', this.aForm.value.title);
    datas.append('price', this.aForm.value.price);
    datas.append('description', this.aForm.value.description);
    datas.append('condition', this.aForm.value.condition);
    datas.append('category', this.selected);
    datas.append('images[]', this.blob);
    datas.append('state_id', this.aForm.value.state_id);
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
    if (data) {
      // this.nav.pop();
      this.modals.dismiss({ refresh: true })
    }
  }
}
