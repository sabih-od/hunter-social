import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { PusherService } from 'src/app/services/pusher-service.service';
import { BasePage } from '../base-page/base-page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage extends BasePage implements OnInit, AfterViewInit {
  item: any;
  messages: any = [];
  text: any;
  user: any;
  @ViewChild('content', { static: true }) private content: IonContent;
  channel_id: any;
  channel: any;
  isLoading = true;
  isMsgLoading = false;
  _img: any;
  testimg: String = 'https://hunterssocial.com/storage/398/DreamShaper_v5_A_small_kif_with_perfect_cute_realistic_face_pl_2.jpg'
  next_page_url = null;

  constructor(injector: Injector, public pusher: PusherService,
    private route: ActivatedRoute, private router: Router
  ) {
    super(injector);
  }
  ngAfterViewInit() {
    // channel.bind(this.event, ({ player }) => {
    //   this.voteCount[player.shortName] += 1
    // });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // Get the value of the query parameter
      console.log('params => ', params)
      if (params) {
        if (params?.is_admin == '1') {
          console.log('andar gaya')
          this.item = {
            "id": "admin",
            // "email": "johnmartin@mailinator.com",
            "name": "Hunter Social",
            // "created_at": "2023-01-20T17:40:57.000000Z",
            "profile_image": "https://hunterssocial.com/assets/images/udpate-logo.png",
            "hasUnread": false,
            "is_admin": true,
          }
        } else if (params?.is_chatbot) {
          console.log('Chatbot pe gaya')
          this.item = {
            "id": "chatbot",
            // "email": "johnmartin@mailinator.com",
            "name": "Big Buck",
            // "created_at": "2023-01-20T17:40:57.000000Z",
            "profile_image": "https://hunterssocial.com/assets/images/udpate-logo.png",
            "hasUnread": false,
            "is_chatbot": true,
          }
        }
      }
    });

    this.initialize();
  }
  newmsgloading = false;
  handleScroll(event) {
    // Your custom logic when scroll reaches the top
    // console.log('Scroll reached the top!', event);
    // console.log('Scroll reached the top!', event.detail.scrollTop);
    if (event.detail.scrollTop == 0 && this.next_page_url) {
      this.newmsgloading = true;
      this.page = this.page + 1;
      console.log('handleScroll this.page => ', this.page)
      console.log('handleScroll this.item => ', this.item)
      if (this.item?.is_admin) this.getAdminMessages();
      else if (this.item?.is_chatbot) this.getChatbotMessages();
      else if (this.item?.isGroup) this.getGruoupChatData();
      else if (this.user) this.getChatData();
    }
  }
  goBack() {
    this.nav.pop();
  }

  async initialize() {
    if (!this.item) {
      this.item = this.dataService.chat_data;
    }
    console.log('initialize this.item => ', this.item)
    this.user = await this.users.getUser();
    if (this.item?.is_admin) this.getAdminMessages();
    else if (this.item?.is_chatbot) this.getChatbotMessages();
    else if (this.item?.isGroup) this.getGruoupChatData();
    else if (this.user) this.getChatData();
  }

  page = 1;
  is_group = false;

  async getChatData() {
    this.is_group = true;
    let res = await this.network.getChatMessages(this.item?.id, this.page);
    console.log('getChatData', res);
    this.isLoading = false;
    this.newmsgloading = false;
    if (res && res.data) {
      this.next_page_url = res.data?.messages.next_page_url;
      console.log('next_page_url => ', this.next_page_url);
      this.channel_id = res.data.channel_id;
      this.dataService.channel_id = res.data.channel_id;
      this.listenMessages();
      res.data.messages.data.sort((a, b) => {
        return b.created_at - a.created_at;
      });
      const reversemessages = res.data.messages.data.reverse();
      this.messages = this.page != 1 ? [...reversemessages, ...this.messages] : reversemessages;
      this.page == 1 && this.scrollToBottom();
      this.page != 1 && this.content.scrollToPoint(0, 220);
    }
    this.updateNotificationCount()
  }

  async getChatbotMessages() {
    let res = await this.network.getChatbotMessages(this.page);
    console.log('getChatbotMessages', res);
    this.isLoading = false;
    if (res && res.data) {
      this.next_page_url = res.data.next_page_url;
      console.log('next_page_url => ', this.next_page_url);
      res.data.data.sort((a, b) => {
        return b.created_at - a.created_at;
      });
      const reversemessages = res.data.data.reverse();
      console.log('reversemessages => ', reversemessages);
      this.messages = this.page != 1 ? [...reversemessages, ...this.messages] : reversemessages;
      if (this.messages.length == 0) {
        this.messages.push({
          prompt_content: '',
          response_content: 'Hello! How can I assist you with your hunting or fishing questions?',
          created_at: new Date().toISOString()
        });
      }
      this.page == 1 && this.scrollToBottom();
      this.page != 1 && this.content.scrollToPoint(0, 220);
    }
  }

  async getAdminMessages() {
    let res = await this.network.getAdminMessages(this.page);
    console.log('getAdminMessages', res);
    this.isLoading = false;
    if (res && res.data) {
      this.next_page_url = res.data.next_page_url;
      console.log('next_page_url => ', this.next_page_url);
      res.data.data.sort((a, b) => {
        return b.created_at - a.created_at;
      });

      let token = localStorage.getItem('token');
      this.pusher.initAdminChannel('admin-chat', token);
      this.channel = this.pusher.getChannel();
      console.log('this.channel => ', this.channel)
      this.channel.bind('adminChatMessage', async ({ message }) => {
        console.log('AdminChatMessage Event Recieved => ', message);
        let self = this;
        // if (message.sender_id !== this.user?.id) {
        this.messages.push({
          content: message.content,
          // channel_id: message.channel_id,
          // sender_id: message.sender_id,
          media_upload: message?.media_upload,
          created_at: message.created_at,
        });
        self.scrollToBottom();
        // }
      });

      // this.channel_id = res.data.channel_id;
      // this.listenMessages();
      // res.data.messages.data.sort((a, b) => {
      //   return b.created_at - a.created_at;
      // });
      const reversemessages = res.data.data.reverse();
      this.messages = this.page != 1 ? [...reversemessages, ...this.messages] : reversemessages;
      this.page == 1 && this.scrollToBottom();
      this.page != 1 && this.content.scrollToPoint(0, 220);
    }
    this.updateNotificationCount()
  }

  async getGruoupChatData() {
    let res = await this.network.getChatRoomMessages(this.item.channel_id, this.page);
    console.log('getGruoupChatData', res);
    this.isLoading = false;
    if (res && res.data) {
      this.next_page_url = res.data?.messages?.next_page_url;
      console.log('next_page_url => ', this.next_page_url);
      this.channel_id = res.data?.channel_id;
      this.listenMessages();
      res.data?.messages?.data?.sort((a, b) => {
        return b?.created_at - a?.created_at;
      });
      res.data.messages.data = res?.data?.messages.data.map((a) => ({
        ...a,
        isGroup: true,
      }));
      const reversemessages = res.data.messages.data.reverse();
      this.messages = this.page != 1 ? [...reversemessages, ...this.messages] : reversemessages;
      this.page == 1 && this.scrollToBottom();
      this.page != 1 && this.content.scrollToPoint(0, 220);
    }
    this.updateNotificationCount()
  }

  removeTempImg() {
    this._img = null;
  }

  async uploadPicture() {
    // return new Promise(async resolve => {
    this._img = await this.image.openCamera();
    console.log(this._img)

    // let blob = (await this.image.base64ToBlob(this._img)) as string;

  }


  listenMessages() {
    let token = localStorage.getItem('token');
    this.pusher.init(this.channel_id, token);
    this.channel = this.pusher.getChannel();
    this.channel.bind('chatMessage', ({ message }) => {
      console.log('Event Recieved => ', message);
      let self = this;
      // if (message.sender_id !== this.user?.id) {
      this.messages.push({
        content: message.content,
        channel_id: message.channel_id,
        sender_id: message.sender_id,
        media_upload: message.media_upload,
        created_at: message.created_at,
      });
      self.scrollToBottom();
      // }
    });
  }

  chatNotifyListener() { }

  scrollToBottom() {
    let self = this;
    setTimeout(() => {
      self.content.scrollToBottom();
    }, 500);
  }

  async updateNotificationCount() {
    // let noticount = await this.network.getUnreadNotificationCount();
    const noticount = await this.network.getUnreadMessageAndNotificationCount();
    console.log('getUnreadMessageAndNotificationCount => ', noticount)
    this.dataService.updateUnreadMessageAndNotificationCount(noticount?.data);

    console.log('noticount => ', noticount.data.unread_count)
    this.dataService.updateNotificationsCount(noticount.data.unread_count)
  }

  async askChatBot() {
    this.isMsgLoading = true;
    console.log('this.text => ', this.text);
    this.messages.push({
      prompt_content: this.text,
      response_content: '',
      created_at: new Date().toISOString()
    });
    this.scrollToBottom();
    const newtext = this.text;
    this.text = '';
    let res = await this.network.sentChatbotMessages(
      { content: newtext }
    );

    console.log('sentChatbotMessages => ', res)
    this.isMsgLoading = false;
    if (res && res.data.answer) {
      const replica = [...this.messages];
      const index = replica.length - 1;
      replica[index].response_content = res.data.answer;
      this.messages = replica;
      // this.messages.push({
      //   prompt_content: this.text,
      //   response_content: res.data.answer,
      //   created_at: new Date().toISOString()
      // });
      this.scrollToBottom();
    } else {
    }

  }

  async sendMessage() {
    this.isMsgLoading = true;
    console.log(this.text);

    // if(this._img != '' || (this._img == '' && this.text != '') || (this._img != '' && this.text != '')){
    // }
    console.log('this._img => ', this._img)
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

        console.log('blob => ', blob)
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
        //   sender_id: this.user?.id,
        //   time: new Date(),
        // });
        // this.scrollToBottom();
      }
      // this.messages.push({
      //   message: this.text,
      //   time: this.getTime(new Date()),
      //   id: this.messages[this.messages.length - 1]?.id + 1,
      // }); 3
      this.text = '';
      this._img = '';
    } else {
      this.isMsgLoading = false;
    }
  }

  getTime(date: Date) {
    return `${date.getHours()}:${date.getUTCMinutes()}`;
  }

  async leave() {
    let isLeave = await this.utility.presentConfirm(
      'Yes',
      'No',
      'Confirm',
      'Are you sure want to leave this group?'
    );
    if (isLeave) {
      let res = await this.network.leaveGroup(this.channel_id);
      console.log('leave group', res);
      if (res && res.data) {
        this.utility.presentSuccessToast(res.message);
        this.nav.pop();
      } else
        this.utility.presentFailureToast(
          res?.message ?? 'Something went wrong'
        );
    }
  }

  // loadmoremessages(ev) {
  //   if (this.next_page_url) {
  //     this.page = this.page + 1;
  //     console.log('this.page => ', this.page)
  //     if (this.item?.is_admin) this.getAdminMessages();
  //     else if (this.user) this.getChatData();
  //     setTimeout(() => {
  //       ev.target.complete();
  //       // (ev as IonInfiniteScrollContent).target.complete();
  //     }, 500);
  //   } else {
  //     ev.target.complete();
  //   }
  // }
}
