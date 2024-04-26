import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.page.html',
  styleUrls: ['./create-story.page.scss'],
})
export class CreateStoryPage extends BasePage implements OnInit {

  aForm: FormGroup;
  _img;
  content;
  post_image;
  _item;
  mediaRemoved = 0;
  user: any = {
    profile_image: '', // Set default profile image URL
    name: '',
    email: ''
  };

  isVideo = false;
  type;
  loadingimage = false;
  isIOS = false;
  postfile

  constructor(injector: Injector, public dom: DomSanitizer, private cdr: ChangeDetectorRef, private loadingController: LoadingController) {
    super(injector);
  }


  async ngOnInit() {
    this.permission.checkStoragePermissions();
    this.user = (await this.users.getUser())
    console.log('this.user => ', this.user)
    this.handleFileClick();

    this.isIOS = this.platform.is('ios');
  }
  handleFileClick() {
    let self = this;

    document.getElementById('fileInput').onchange = function (value: any) {
      // self.loadingimage = true;
      //alert('Selected file: ' + value);
      let file = value.target.files[0];
      self.postfile = file;
      console.log(file);
      console.log('self.postfile => ', self.postfile)
      if (!file) return;
      const reader = self.getFileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        console.log('OnLoaded');

        // get the blob of the image:
        console.log(reader);

        let blob: Blob = new Blob([
          new Uint8Array(reader.result as ArrayBuffer),
        ]);
        // self.loadingimage = false;
        console.log(blob);
        self.post_image = self.dom.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );

        self._img = blob;
        console.log('self._img => ', self._img)
        self.isVideo = self.image.isVideo(file.name);
        // create blobURL, such that we could use it in an image element:

        self.cdr.detectChanges();
      };

      reader.onerror = (error) => {
        // self.loadingimage = false;
        console.log('Error Occured');
        console.log(error);
        //handle errors
      };
    };
  }

  removeMedia() {
    this.mediaRemoved = 1;
    this._img = null;
    this.post_image = null;
  }

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ];
    return zoneOriginalInstance || fileReader;
  }

  close() {
    console.log('close working')
    this.removeMedia()
    this.modals.dismiss()
  }

  async post() {
    const loading = await this.loadingController.create({
      message: 'Posting...',
    });
    await loading.present();

    try {
      let data = new FormData();
      data.append('content', this.content);
      if (this._img) {
        data.append('media', this.postfile)
        data.append('title', 'title')
      } else {
        data.append('media', '');
        data.append('title', 'title')
      }

      if (this._item) {
        data.append('_method', 'PUT');
        data.append('is_media_remove', this.mediaRemoved.toString());
      }

      let res = await this.network.createStory(data);

      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.modals.dismiss(res.data)
      } else {
        this.utility.presentFailureToast(
          res?.message
            ? res.message
            : res?.error && res.error.errors.post_file
              ? res.error.errors.post_file
              : 'Something went wrong'
        );
      }
    } catch (error) {
      console.error('Error while posting:', error);
      this.utility.presentFailureToast('Something went wrong');
    } finally {
      await loading.dismiss();
    }
  }
}
