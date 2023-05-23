import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { FileSelectResult } from 'capacitor-file-select';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-post-adventure-content',
  templateUrl: './post-adventure-content.page.html',
  styleUrls: ['./post-adventure-content.page.scss'],
})
export class PostAdventureContentPage extends BasePage implements OnInit {
  aForm: FormGroup;
  _img;
  content;
  post_image;
  _item;
  mediaRemoved = 0;
  user_image;
  isVideo = false;
  type;

  @Input() set item(val) {
    this._item = val;
    console.log(val);
    this.content = val.content;
    this.post_image = val.media_upload.url;
  }

  get item() {
    return this._item;
  }

  constructor(injector: Injector, public dom: DomSanitizer) {
    super(injector);
  }

  async ngOnInit() {
    this.permission.checkStoragePermissions();
    this.user_image = (await this.users.getUser()).profile_image;
    this.handleFileClick();
  }

  handleFileClick() {
    let self = this;
    document.getElementById('fileInput').onchange = function (value: any) {
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
        console.log(blob);
        self.post_image = self.dom.bypassSecurityTrustUrl(
          URL.createObjectURL(blob)
        );
        self._img = blob;
        self.isVideo = self.image.isVideo(file.name);

        // create blobURL, such that we could use it in an image element:
      };

      reader.onerror = (error) => {
        console.log('Error Occured');

        console.log(error);

        //handle errors
      };
    };
  }

  async doGetPicture() {
    // let isImage = await this.alert.presentConfirm(
    //   'Image',
    //   'Video',
    //   'Source',
    //   'Choose source'
    // );
    // if (isImage) {
    //   let res = await this.image.openCamera();
    //   const { base64, blob } = res;
    //   this._img = blob;
    //   this.post_image = base64;
    //   //   this.type = ffile.mediaType;
    //   this.isVideo = false;
    // } else {
    let file = await this.image.pickMediaFiles();
    if (file) {
      console.log('Selected file', file);
      const { base64, blob, path, isVideo } = file;
      // var objectURL = URL.createObjectURL(file);
      // this._img = objectURL;
      this.post_image = this.dom.bypassSecurityTrustUrl(
        URL.createObjectURL(blob)
      );
      this._img = blob;
      this.isVideo = isVideo;
      //}
      // if (file) {
      //   // if (this.platform.is('ios')) {
      //   //   let ffile = file as ChooserResult;
      //   //   console.log(ffile);
      //   //   this.post_image = ffile.name;
      //   //file = file.replace('file:///', 'http://localhost/_capacitor_file_/');

      //   // URL.revokeObjectURL(this._img);
      //   // this._img = URL.createObjectURL(file);
      //   //const blob = await fetch(file.toString()).then((r) => r.blob());
      //   //   console.log('blob', blob);
      //   // var objectURL = URL.createObjectURL(file);
      //   // console.log(objectURL);

      //   this._img = file;
      //   this.post_image = file;
      //   //   this.type = ffile.mediaType;
      //   this.isVideo = true; //this.image.isVideo(ffile.mediaType);
      //   // } else {
      //   //   let ffile = file as FileSelectResult;
      //   //   this.post_image = ffile.path;
      //   //   const blob = await fetch(file.toString()).then((r) => r.blob());
      //   //   console.log('blob', blob);
      //   //   this._img = file;
      //   //   this.type = blob.type;
      //   //   this.isVideo = this.image.isVideo(blob.type);
      //   // }

      //   // let path = file.path.toString().replace('_capacitor_file_', '');
      //   // this._img = path;
      //   // console.log('FilePath', path);
      // }
    }
    // return;
    // this._img = await this.image.openCamera();
    // if (this._img && this._img['base64String'])
    //   this.post_image = `data:image/${this._img['format']};base64,${this._img['base64String']}`;
    // console.log('image', this.post_image);
  }

  async post() {
    let data = new FormData();
    data.append('content', this.content);
    if (this._img) {
      // let blob = await this.image.b64toBlob(
      //   this._img['base64String'],
      //   'image/' + this._img['format']
      // );
      // let obj = {
      //   uri: filePath,
      //   name: file.name,
      //   type: file.type,
      // };
      data.append('post_file', this._img);
    } else data.append('post_file', '');

    if (this._item) {
      data.append('_method', 'PUT');
      data.append('is_media_remove', this.mediaRemoved.toString());
    }

    let res = await this.network.postData(data, this._item?.id);
    console.log(res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.close(true);
    } else
      this.utility.presentFailureToast(
        res?.message
          ? res.message
          : res?.error && res.error.errors.post_file
          ? res.error.errors.post_file
          : 'Something went wrong'
      );
  }

  close(refresh) {
    this.modals.dismiss({ refresh: refresh });
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
}
