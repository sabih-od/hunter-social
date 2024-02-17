import { Component, Injector, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { Config } from 'src/app/config/main.config';
import { BasePage } from '../base-page/base-page';
import { DatingFilterComponent } from './dating-filter/dating-filter.component';
import { UserDetailComponentComponent } from './user-detail-component/user-detail-component.component';

@Component({
  selector: 'app-dating',
  templateUrl: './dating.page.html',
  styleUrls: ['./dating.page.scss'],
})
export class DatingPage
  extends BasePage
  implements OnInit, ViewWillEnter, ViewWillLeave {
  datings;
  all_datings = [];
  loading = false;
  refresh = false;
  search = '';
  dating_users = 1;
  showmodal = true;
  page = 1;
  next_page_url = null;

  constructor(injector: Injector, private iab: InAppBrowser) {
    super(injector);
  }

  ionViewWillLeave() {
    this.dataService.searchValueChanged.unsubscribe();
    console.log('Unsubscribed');
  }

  ionViewWillEnter() {
    this.dataService.searchValueChanged.subscribe((e) => {
      this.datings = this.all_datings.filter((dating) =>
        dating.name?.toLowerCase().includes(e.toLowerCase())
      );
      console.log('dataService.searchValueChanged res => ', this.datings);
      console.log('DatingPage Search', e);
    });
  }

  async ngOnInit() {
    this.loading = true;
    // this.datings = this.dataService.getDatings();
    this.events.subscribe('DATING_UPDATED', this.getData.bind(this));
    this.checkUser();
    // let data = await this.modals.present(UserDetailComponentComponent);

    this.events.subscribe('DISCLAIMER_CLOSED', this.showTips.bind(this));


  }

  showTips() {
    console.log('DISCLAIMER_CLOSED');
    const tipsread = localStorage.getItem('dating_tips_read');
    if (!tipsread) {
      setTimeout(() => {
        this.introMethod();
        localStorage.setItem('dating_tips_read', 'true');
      }, 1000);
    }
  }

  introMethod() {
    // import IntroJS
    const IntroJs = require("./../../../../node_modules/intro.js/intro");
    let intro = IntroJs();
    console.log("inside intro.js");
    intro.setOptions({
      steps: [
        {
          element: "#step1",
          intro: "Search by specifying gender, country, category, and age preferences to discover meaningful connections that align with your preferences",
          position: "bottom"
        },
        {
          element: "#step2",
          intro: "Find your perfect match effortlessly by entering specific criteria into our search field",
          position: "bottom"
        },
        {
          element: "#dating0",
          intro: "Easily connect by adding friends, remove connections with unfriending and cancel request",
          position: "top"
        },
        {
          element: "#dot0",
          intro: "Block user and maintain a safe community by reporting any concerns",
          position: "top"
        }
      ],
      showProgress: false,
      // skipLabel: "Annuler",
      doneLabel: "Done",
      nextLabel: "Next",
      prevLabel: "Prev",
      overlayOpacity: "0.6"
    });
    intro.start();
  }

  async checkUser() {
    // let res = await this.network.getUser();
    // console.log('checkUser', res);

    // if (
    //   res &&
    //   res.data &&
    //   res.data.user?.profile_detail &&
    //   !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
    //   res.data.user?.profile_detail.is_dating_profile
    // ) {
    this.getData();
    //  } else this.editUser();
  }

  async doRefresh($event) {
    this.refresh = true;
    this.page = 1;
    await this.getData();
    $event.target.complete();
  }

  async getData(data = null) {
    console.log('getData data => ', data)
    if (data) {
      // this.datings.find(x => x.id == data.addressee_id)
      const index = this.datings.findIndex(x => x.id == data.addressee_id)
      if (data.type == 'addfriend') {
        this.datings[index].is_sent_friend_request = true
        this.datings[index].canRequest = false
        this.all_datings = [...this.datings];
      } else if (data.type == 'cancelRequest' || data.type == 'unfriend') {
        this.datings[index].is_sent_friend_request = false
        this.datings[index].canRequest = true
        this.datings[index].is_friend = false
        this.all_datings = [...this.datings];
      } else if (data.type == 'acceptRequest') {
        this.datings[index].is_sent_friend_request = false
        this.datings[index].canRequest = false
        this.datings[index].is_friend_requested = false
        this.datings[index].is_friend = true
      } else if (data.type == 'block') {
        this.datings = this.datings.filter(x => x.id != data.addressee_id)
      }
      console.log('getData', this.datings);
      return;
    }

    let res = await this.network.getDatings(this.dating_users, this.search, this.page);
    console.log('network.getDatings res => ', res);
    if (res && res.data) {
      if (res.data.next_page_url) this.next_page_url = res.data.next_page_url;
      const newDatingData = res?.data?.data?.map((obj) => ({
        ...obj,
        profile_image: obj.profile_image
          ? this.image.getImageUrl(obj.profile_image)
          : this.image.getDefaultImg(),
        age: this.getAge(obj.profile_detail.dob),
        canRequest:
          !obj.is_sent_friend_request &&
          !obj.is_friend &&
          !obj.is_blocked_by_friend &&
          !obj.is_friend_blocked,
      }));
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }

    this.all_datings = [...this.datings];

    console.log('Here Datings getData dating.page.ts => ', this.datings);
    this.loading = false;
    this.refresh = false;
  }

  async searchData(d) {
    this.datings = [];
    console.log('Searching', d);

    let res = await this.network.searchDatingUsers(d);
    if (res && res.data) {
      if (res.data.next_page_url) this.next_page_url = res.data.next_page_url;
      const newDatingData = res?.data?.data.map((obj) => ({
        ...obj,
        profile_image: obj.profile_image
          ? this.image.getImageUrl(obj.profile_image)
          : this.image.getDefaultImg(),
        age: this.getAge(obj.profile_detail.dob),
        canRequest:
          !obj.is_sent_friend_request &&
          !obj.is_friend &&
          !obj.is_blocked_by_friend &&
          !obj.is_friend_blocked,
      }));
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }

    this.all_datings = [...this.datings];

    console.log('Here Datings searchData ', this.datings);
    this.loading = false;
  }

  getAge(dob: any) {
    let date = new Date(dob);
    let now = new Date();
    const years = Math.abs(now.getFullYear() - date.getFullYear());
    return years;
  }

  openWebView() {
    const browser = this.iab.create(Config.URL + 'public/dating', '_self', {
      location: 'no',
      zoom: 'no',
    }); /*3*/
  }


  hideModal() {
    this.showmodal = false;
  }

  async editUser() {
    let data = await this.modals.present(UserDetailComponentComponent);
    console.log(data);
    if (data.data?.success) this.getData();
  }

  onIonInfinite(ev) {

    if (this.next_page_url != null) {
      this.page = this.page + 1;
      this.getData();
      setTimeout(() => {
        ev.target.complete();
        // (ev as IonInfiniteScrollContent).target.complete();
      }, 500);
    } else {
      ev.target.complete();
    }
  }

  ages;
  genders;
  interests;
  city;
  cityname;
  state;
  statename;
  questions;
  ethnicities;
  tag_option_ids;
  filters = {}

  async filter() {
    this.page = 1;
    this.next_page_url = null;
    let data = await this.modals.present(
      DatingFilterComponent,
      {
        filteredages: this.ages,
        filteredgenders: this.genders,
        filteredinterests: this.interests,
        filteredstate: this.state,
        filteredcity: this.city,
        filteredethnicities: this.ethnicities,
        filteredtagids: this.tag_option_ids
      },
      // {},
      // this.filters,
      'halfmodal'
    );
    console.log('Filter_Data', data);

    const d = data.data;
    console.log('d => ', d);
    this.filters = d.data;
    console.log('this.filters => ', this.filters);

    this.ages = d.data?.ages ? d.data?.ages.split('|') : '';
    this.genders = d.data?.genders ? d.data?.genders.split('|') : '';
    this.interests = d.data?.interests ? d.data?.interests.split('|') : ''
    this.ethnicities = d.data?.ethnicities ? d.data?.ethnicities.split('|') : ''
    this.city = d.data?.city ? d.data?.city : ''
    this.cityname = d.data?.cityname?.name ? d.data?.cityname?.name : ''
    this.state = d.data?.state ? d.data?.state : ''
    this.statename = d.data?.statename?.name ? d.data.statename?.name : ''
    this.questions = d.data?.selectedques;
    this.tag_option_ids = d.data.tag_option_ids;


    console.log('d', d);
    if (d.data != 'A') {
      this.loading = true;
      this.searchData(d.data);
    }
  }
}
