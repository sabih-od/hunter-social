import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BasePage } from '../../base-page/base-page';
import { Http } from '@capacitor-community/http';
import { Config } from 'src/app/config/main.config';

@Component({
  selector: 'app-card-submission',
  templateUrl: './card-submission.component.html',
  styleUrls: ['./card-submission.component.scss'],
})
export class CardSubmissionComponent extends BasePage implements OnInit {
  video;
  title;
  post_file;
  item;

  constructor(injector: Injector, public dom: DomSanitizer) {
    super(injector);
  }

  ngOnInit() {
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
        let blob: Blob = new Blob([
          new Uint8Array(reader.result as ArrayBuffer),
        ]);
        console.log(blob);

        // create blobURL, such that we could use it in an image element:
        self.video = self.dom.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        self.post_file = blob;
      };

      reader.onerror = (error) => {
        console.log('Error Occured');

        console.log(error);

        //handle errors
      };
    };

    this.events.subscribe('EDIT_VIDEO', (item) => {
      console.log('ITEM', item);
      this.title = item.title;
      this.video = item.media_upload.url;
      this.item = item;
    });
  }

  select_Video() {
    document.getElementById('fileInput').dispatchEvent(new Event('click'));
  }

  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)[
      '__zone_symbol__originalInstance'
    ];
    return zoneOriginalInstance || fileReader;
  }

  async selectVideo() {
    let file = await this.image.pickMediaFiles(true);
    if (file) {
      console.log('Selected file', file);
      const { base64, blob, path, isVideo } = file;
      this.video = this.dom.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this.post_file = blob;
    }
  }

  postVideo() {
    if (!this.title) this.utility.presentToast('Please insert video title');
    else if (!this.post_file && !this.item)
      this.utility.presentToast('Please select video');
    else this.doPost(this.post_file);
  }

  fileSelected() {
    alert('File Selected xD');
    var name: any = document.getElementById('fileInput');
    alert('Selected file: ' + name.files.item(0).name);
    alert('Selected file: ' + name.files.item(0).size);
    alert('Selected file: ' + name.files.item(0).type);
  }

  async postData() {
    // if (!this.post_file) {
    //   this.utility.presentFailureToast('Please select a file first');
    //   return;
    // }
    let data = new FormData();
    data.append('title', this.title);
    // let filePath = this.post_file;
    // console.log('filePath', filePath);
    // var filename = filePath.replace(/^.*[\\\/]/, '');
    // let obj: any = {
    //   uri: filePath,
    //   name: filename,
    //   type: 'video/mp4',
    // };
    // console.log('UPLOAD_FILE', obj);
    if (!this.item || (this.item && this.item.media_upload.url !== this.video))
      data.append('video', this.post_file);
    else data.append('video', '');

    if (this.item) data.append('_method', 'PUT');
    // data.append('video', this.post_file);
    let res = await this.network.postHowToVideo(data, this.item?.id);
    console.log('postData', res);
    if (res && res.data) {
      this.utility.presentSuccessToast(res.message);
      this.events.publish('HOW_TO_POST_UPDATED');
      this.video = null;
      this.title = null;
      this.postVideo = null;
      this.cancel();
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
  }

  upload(filePath) {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'Bearer 374|5ACFiCS5c2bbezMMVZe6Cz5L92oLt3HslhcEHLnr'
    );

    let data = new FormData();
    data.append('title', this.title);
    console.log('filePath', filePath);
    // var filename = filePath.replace(/^.*[\\\/]/, '');
    // let obj: any = {
    //   uri: filePath,
    //   name: filename,
    //   type: 'video/mp4',
    // };
    //console.log('UPLOAD_FILE', obj);
    //  data.append('video', obj);

    fetch(Config.URL + 'public/api/how-to-videos', {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    })
      .then((response) => response.text())
      .then((result) => console.log('File Upload Result', result))
      .catch((error) => console.log('File Upload Error', error));
  }

  async doPost(filePath) {
    let data = new FormData();
    data.append('title', this.title);
    console.log('filePath', filePath);
    var filename = filePath.replace(/^.*[\\\/]/, '');
    var directory = filePath.match(/(.*)[\/\\]/)[1] || '';

    console.log('Directory', directory);

    let obj: any = {
      uri: filePath,
      name: filename,
      type: 'video/mp4',
    };
    console.log('UPLOAD_FILE', obj);
    data.append('video', obj);
    const options = {
      url: Config.URL + 'public/api/how-to-videos',
      headers: {
        Authorization: 'Bearer 374|5ACFiCS5c2bbezMMVZe6Cz5L92oLt3HslhcEHLnr',
      },
      data: { title: this.title },
      name: 'video',
      filePath: filename,
      fileDirectory: directory,
    };

    const response = await Http.uploadFile(options);
    console.log('Http Response', response);
    console.log('Http Response data', response?.data);

    // or...
    // const response = await Http.request({ ...options, method: 'POST' })
  }

  cancel() {
    this.item = null;
    this.video = null;
    this.post_file = null;
    this.title = null;
  }
}
