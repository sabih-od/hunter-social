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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage extends BasePage implements OnInit, AfterViewInit {
  item: any;
  messages: any;
  text: any;
  user: any;
  @ViewChild('content') private content: IonContent;
  channel_id: any;
  channel: any;
  isLoading = true;
  isMsgLoading = false;

  constructor(injector: Injector, public pusher: PusherService) {
    super(injector);
  }
  ngAfterViewInit() {
    // channel.bind(this.event, ({ player }) => {
    //   this.voteCount[player.shortName] += 1
    // });
  }

  ngOnInit() {
    this.initialize();
  }

  goBack() {
    this.nav.pop();
  }

  async initialize() {
    this.item = this.dataService.chat_data;
    this.user = await this.users.getUser();
    console.log(this.item);
    if (this.item.isGroup) await this.getGruoupChatData();
    else this.getChatData();
    this.isLoading = false;
  }

  async getChatData() {
    let res = await this.network.getChatMessages(this.item.id);
    console.log('getChatData', res);
    if (res && res.data) {
      this.channel_id = res.data.channel_id;
      this.listenMessages();
      res.data.messages.data.sort((a, b) => {
        return b.created_at - a.created_at;
      });
      this.messages = res.data.messages.data.reverse();
      this.scrollToBottom();
    }
  }

  async getGruoupChatData() {
    let res = await this.network.getChatRoomMessages(this.item.channel_id);
    console.log('getGruoupChatData', res);
    if (res && res.data) {
      this.channel_id = res.data.channel_id;
      this.listenMessages();
      res.data.messages.data.sort((a, b) => {
        return b.created_at - a.created_at;
      });
      res.data.messages.data = res.data.messages.data.map((a) => ({
        ...a,
        isGroup: true,
      }));
      this.messages = res.data.messages.data.reverse();
      console.log('getGruoupChatData after', this.messages);
      this.scrollToBottom();
    }
  }

  listenMessages() {
    let token = localStorage.getItem('token');
    this.pusher.init(this.channel_id, token);
    this.channel = this.pusher.getChannel();
    this.channel.bind('chatMessage', ({ message }) => {
      console.log('Event Recieved', message);
      let self = this;
      // if (message.sender_id !== this.user.id) {
      this.messages.push({
        content: message.content,
        channel_id: message.channel_id,
        sender_id: message.sender_id,
        created_at: message.created_at,
      });
      self.scrollToBottom();
      // }
    });
  }

  chatNotifyListener() {}

  scrollToBottom() {
    let self = this;
    setTimeout(() => {
      self.content.scrollToBottom();
    }, 500);
  }

  async sendMessage() {
    this.isMsgLoading = true;
    console.log(this.text);
    if (this.text && this.text !== '') {
      let res = await this.network.sendChatMessages(
        { content: this.text },
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
}
