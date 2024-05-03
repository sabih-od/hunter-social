import { ChangeDetectorRef, Component, Inject, Injector, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  loadingimage = false;
  isIOS = false;
  postfile

  @ViewChild('file') fileInput!: ElementRef;

  @Input() set item(val) {
    this._item = val;
    console.log(val);
    this.content = val.content;
    this.post_image = val.media_upload.url;
  }

  get item() {
    return this._item;
  }

  constructor(injector: Injector, public dom: DomSanitizer, private cdr: ChangeDetectorRef) {
    super(injector);
  }

  async ngOnInit() {
    this.permission.checkStoragePermissions();
    this.user_image = (await this.users.getUser()).profile_image;
    // this.handleFileClick();

    this.isIOS = this.platform.is('ios');
  }

  fileSelected(event: any) {
    let self = this;
    
    const file: File = event.target.files[0]; // Get the selected file
    if (file) {
      self.postfile = file;
      console.log(file);
      console.log('self.postfile => ', self.postfile)
      if (!file) return;
      const reader = self.getFileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        console.log('OnLoaded');
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: file.type });
        self._img = blob;
        const imageUrl = self.dom.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        self.post_image = imageUrl;
        console.log('self.post_image => ', self.post_image)

        self.isVideo = self.image.isVideo(file.name);
        self.cdr.detectChanges();
      };

      reader.onerror = (error) => {
        // self.loadingimage = false;
        console.log('Error Occured');
        console.log(error);
        //handle errors
      };
    }
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
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: file.type });
        self._img = blob;
        const imageUrl = self.dom.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        self.post_image = imageUrl;
        console.log('self.post_image => ', self.post_image)

        self.isVideo = self.image.isVideo(file.name);
        self.cdr.detectChanges();
      };

      reader.onerror = (error) => {
        // self.loadingimage = false;
        console.log('Error Occured');
        console.log(error);
        //handle errors
      };
    }
    
  }
  async post() {
    let data = new FormData();
    data.append('content', this.content);
    if (this._img) {
      console.log('post this._img => ', this._img)
      data.append('post_file', this.postfile)
      // data.append('post_file', this._img);
    } else data.append('post_file', '');

    if (this._item) {
      console.log('this._item => ', this._item)
      data.append('_method', 'PUT');
      data.append('is_media_remove', this.mediaRemoved.toString());
    }

    console.log('data => ', data.get('post_file'))
    let res = await this.network.postData(data, this._item?.id);
    console.log(res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      // this.events.publish('POST_ADDED', { data: res.data });
      this.modals.dismiss(res.data)
      // this.close(true);
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
    console.log('remove button working')
    this.mediaRemoved = 1;
    this._img = null;
    this.post_image = null;

    this.fileInput.nativeElement.value = '';

    // After updating the post_image, trigger change detection
    this.cdr.detectChanges();
  }

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ];
    return zoneOriginalInstance || fileReader;
  }
}
