import { Component, OnInit, ViewChild, ElementRef, Injector, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BasePage } from '../base-page/base-page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-post-adventure-content',
  templateUrl: './post-adventure-content.page.html',
  styleUrls: ['./post-adventure-content.page.scss'],
})
export class PostAdventureContentPage extends BasePage implements OnInit {
  @ViewChild('file') fileInput!: ElementRef;
  @Input() item: any;
  post_image; // Ensure post_image can handle Blob or string
  content = '';
  isVideo = false;
  loadingimage = false;
  isIOS = false;
  viewImage;

  constructor(injector: Injector, public dom: DomSanitizer, private cdr: ChangeDetectorRef) {
    super(injector);
  }

  ngOnInit() {
    this.isIOS = this.platform.is('ios');
  }

  async takePicture() {
    if (Capacitor.isPluginAvailable('Camera')) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        });
        this.viewImage = this.dom.bypassSecurityTrustUrl(image.webPath);
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        this.post_image = blob;
        this.isVideo = false;
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error taking picture', error);
        this.utility.presentFailureToast('Error taking picture');
      }
    } else {
      this.utility.presentFailureToast('Camera not available');
    }
  }

  async pickImage() {
    if (Capacitor.isPluginAvailable('Camera')) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos
        });
        this.viewImage = this.dom.bypassSecurityTrustUrl(image.webPath);
        if (image.webPath.startsWith('http')) {
          const blob = await fetch(image.webPath).then(r => r.blob());
          this.post_image = blob;
        } else {
          // Assuming Filesystem.readFile returns a base64 encoded string
          const file = await Filesystem.readFile({
            path: image.path
          });
          // Convert base64 string to Blob
          this.post_image = this.b64toBlob(file.data, 'image/jpeg');
        }
        this.isVideo = image.format === 'video';
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error picking image', error);
        this.utility.presentFailureToast('Error picking image');
      }
    } else {
      this.utility.presentFailureToast('Camera/Photos not available');
    }
  }

  b64toBlob(b64Data, contentType = 'image/jpeg', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length).fill(null).map((_, i) => slice.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.post_image = reader.result;
        this.isVideo = file.type.startsWith('video');
        this.cdr.detectChanges();
      };
    }
  }

  async post() {
    this.loadingimage = true;
    try {
      let data = new FormData();
      data.append('content', this.content);
      if (this.post_image && this.post_image instanceof Blob) {
        data.append('post_file', this.post_image, 'uploaded_image.jpg'); // Correct handling of Blob
      }

      await this.processPost(data); // Send data to your server
    } catch (error) {
      console.error('Error while posting:', error);
      this.utility.presentFailureToast('Something went wrong');
      this.loadingimage = false;
    }
  }

  async processPost(data: FormData) {
    let res = await this.network.postData(data, this.item?.id); // Ensure network.postData can handle FormData
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.modals.dismiss(res.data);
      console.log(res)
    } else {
      this.utility.presentFailureToast(
        res?.message
          ? res.message
          : 'Something went wrong'
      );
    }
    this.loadingimage = false;
  }

  removeMedia() {
    this.post_image = null;
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  close(refresh) {
    this.modals.dismiss({ refresh: refresh });
  }
}
