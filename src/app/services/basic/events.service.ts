import { Injectable } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  latestEvent = 'randomLast';
  historicalEvent = 'randomHistory';

  subscriptions: any[] = [];

  constructor(public pubsubSvc: NgxPubSubService) {
    pubsubSvc.registerEventWithHistory(this.historicalEvent, 6);
    pubsubSvc.registerEventWithLastValue(this.latestEvent, undefined);
  }

  publish(key: string, data = {}) {
    this.pubsubSvc.publishEvent(key, data);
  }

  async subscribe(key, handler) {

    const item = this.subscriptions.find( x => x.key === key);
    if(item){
      this.unsubscribe(key);
    }

    const subs = this.pubsubSvc.subscribe(key, data => handler(data));
    this.subscriptions.push({key,subs});


    //this.subscribe[key] = subs;

  }

  unsubscribe(key) {
    console.log('unsubscribe', key);
    console.log('unsubscribe-array', this.subscriptions);
    const item = this.subscriptions.find( x => x.key === key);
    console.log(item);
    if(item){
      const subs = item['subs'];
      subs.unsubscribe();

      const index = this.subscriptions.findIndex( x => x.key === key);
      if (index > -1) {
        this.subscriptions.splice(index, 1);
      }


    }

  }

}
