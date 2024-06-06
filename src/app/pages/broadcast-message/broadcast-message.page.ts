import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from '../base-page/base-page';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.page.html',
  styleUrls: ['./broadcast-message.page.scss'],
})
export class BroadcastMessagePage extends BasePage implements OnInit {
  isMsgLoading = false;
  _img;
  image;
  text = '';
  channel_id;
  constructor(injector: Injector,) {
    super(injector);
  }

  ngOnInit() {
  }

  async sendMessage() {
    this.isMsgLoading = true;

    // if(this._img != '' || (this._img == '' && this.text != '') || (this._img != '' && this.text != '')){
    // }
    if ((this._img && this._img != '') || (this.text && this.text != '')) {
      // if (this.text && this.text !== '') {
      // let blob = (await this.image.base64ToBlob(this._img)) as string;

      let formData = new FormData();
      formData.append('content', this.text ? this.text : '');

      if (this._img && this._img != '') {
        const base64Data = this._img.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        const binaryData = new Uint8Array(atob(base64Data).split('').map((char) => char.charCodeAt(0)));
        const blob = new Blob([binaryData], { type: 'image/jpeg' }); // Update the MIME type if needed
        // const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        // const binaryData = atob(this._img);
        // // Create a Blob from binary data
        // const blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], {
        //   type: 'image/jpeg', // Specify the MIME type of the image
        // });

        formData.append('file', blob);
      }
      let res = await this.network.sendChatMessages(
        formData
        // { content: this.text, file: blob }
        ,
        this.channel_id
      );
      this.isMsgLoading = false;
      if (res && res.data) {
        // this.messages.push({
        //   content: this.text,
        //   channel_id: this.channel_id,
        //   sender_id: this.user.id,
        //   time: new Date(),
        // });
        // this.scrollToBottom();
      }
      // this.messages.push({
      //   message: this.text,
      //   time: this.getTime(new Date()),
      //   id: this.messages[this.messages.length - 1].id + 1,
      // }); 3
      this.text = '';
      this._img = '';
    } else {
      this.isMsgLoading = false;
    }
  }

  async uploadPicture() {
    // return new Promise(async resolve => {
    this._img = await this.image.openCamera();

    // let blob = (await this.image.base64ToBlob(this._img)) as string;

  }

  close() {
    this.modals.dismiss();
  }

}
