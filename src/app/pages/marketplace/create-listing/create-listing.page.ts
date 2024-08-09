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
  pickedImages = [];
  blobImages = [];
  blob;

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

  async doGetPicture() {
    try {
      const images = await Camera.pickImages({
        quality: 90,
        limit: 6
      });

      if (images && images.photos) {
        this.pickedImages = images.photos;

        // Convert each picked image to a blob and store it in blobImages array
        for (const photo of this.pickedImages) {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          this.blobImages.push(blob);
        }
      }
    } catch (error) {
      console.error('Error picking images:', error);
    }
  }

  isFileTypeAllowed(filePath: string): boolean {
    const allowedFileTypes = ['.jpeg', '.png', '.jpg', '.gif'];
    const fileType = filePath.toLowerCase().substr(filePath.lastIndexOf('.'));

    return allowedFileTypes.includes(fileType);
  }

  removeimage(ind) {
    this.pickedImages = this.pickedImages.filter((item, index) => ind != index);
  }

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
      this.picture = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.image_url = file;
  }

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
    this.aForm = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      condition: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      state_id: ['', Validators.compose([Validators.required])],
      image: [''],
      user_id: [''],
      category_id: [''],
      picture: [''],
    });
    this.aForm.get('category').valueChanges.subscribe(value => {
      this.changeCategory(value);
    });
  }

  convertBase64ToBlob(base64: string, contentType: string = 'image/png', sliceSize: number = 512): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  async post() {
    let datas = new FormData();

    datas.append('title', this.aForm.value.title);
    datas.append('price', this.aForm.value.price);
    datas.append('description', this.aForm.value.description);
    datas.append('condition', this.aForm.value.condition);
    datas.append('category', this.selected);
    datas.append('state_id', this.aForm.value.state_id);
    datas.append('user_id', this.userId);
    datas.append('category_id', this.category_id);

    // Append each blob image to the FormData
    this.blobImages.forEach((blob, index) => {
      datas.append(`images[${index}]`, blob);
    });

    // Append the picture if available
    if (this.picture) {
      const pictureBlob = this.convertBase64ToBlob(this.picture);
      datas.append('picture', pictureBlob);
    }

    try {
      let data = await this.network.createListing(datas);
      if (data) {
        this.nav.pop()
        // this.modals.dismiss({ refresh: true });
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  }
}
