import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.component.html',
  styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends BasePage implements OnInit {

  aForm: FormGroup;
  _img;
  content;
  post_image;
  _item;
  mediaRemoved = 0;
  user_image;
  isVideo = false;
  type;
  loadingimage = false;
  isIOS = false;

  constructor(injector: Injector, public dom: DomSanitizer) {
    super(injector);
  }


  async ngOnInit() {
    this.permission.checkStoragePermissions();
    this.user_image = (await this.users.getUser()).profile_image;
    this.handleFileClick();

    this.isIOS = this.platform.is('ios');
  }
  handleFileClick() {
    let self = this;

    document.getElementById('fileInput').onchange = function (value: any) {
      // self.loadingimage = true;
      //alert('Selected file: ' + value);
      let file = value.target.files[0];
      console.log(file);
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
    this.modals.dismiss()
  }

}
