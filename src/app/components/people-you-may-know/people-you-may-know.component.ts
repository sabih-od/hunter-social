import { Component, Injector, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'app-people-you-may-know',
  templateUrl: './people-you-may-know.component.html',
  styleUrls: ['./people-you-may-know.component.scss'],
})
export class PeopleYouMayKnowComponent extends BasePage implements OnInit {

  datings;
  all_datings = [];
  loading = false;
  refreshing = false;
  search = '';
  dating_users = 0;
  role_id;
  dating_enabled = false;
  _search = '';
  page = 1;
  next_page_url = null;

  constructor(injector: Injector) { super(injector); }

  ionViewWillLeave() {
    this.dataService.searchValueChanged.unsubscribe();
    console.log('Unsubscribed');
  }

  datingEnable() {
    return new Promise<boolean>(async (resolve) => {
      let res = await this.network.getUser();
      console.log('checkUser', res);

      if (
        res &&
        res.data &&
        res.data.user?.profile_detail &&
        !this.utility.isNullOrEmpty(res.data.user?.profile_detail.gender) &&
        res.data.user?.profile_detail.is_dating_profile
      ) {
        resolve(true);
        // this.openDatingChatRoom();
      } else resolve(false);
      //else this.editUser();
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.dating_enabled = await this.datingEnable();
    // this.datings = this.dataService.getDatings();
    this.events.subscribe('DATING_UPDATED', this.getData.bind(this));
    this.checkUser();
    // this.loading = false;
    const res = await this.users.getUser();
    this.role_id = res.role_id;
    console.log('USRE', this.role_id);

    this.dataService.searchValueChanged.subscribe((e) => {
      this.datings = this.all_datings.filter((dating) =>
        dating.name?.toLowerCase().includes(e.toLowerCase())
      );
      console.log('DatingPage Search', e);
    });
    // let data = await this.modals.present(UserDetailComponentComponent);
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

  slideOpts = {
    slidesPerView: 2.2,
    spaceBetween: 10,

    // freeMode: true,
    coverflowEffect: {
      // rotate: 50,
      // stretch: 0,
      // depth: 100,
      // modifier: 1,
      slideShadows: false,
    }
  }
  friends = [1, 2, 3, 4, 5, 6, 7, 8]


  async getData(data = null) {
    console.log('dating component getData data => ', data)
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

    console.log('this._search => ', this._search)

    let res = await this.network.getDatings(this.dating_users, this._search, this.page);
    console.log('getDating => ', res?.data?.data);
    this.next_page_url = res?.data?.next_page_url;
    console.log('this.next_page_url => ', this.next_page_url)
    if (res && res?.data?.data) {
      // var newdata = res.data.splice(0,10)
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
          !obj.is_friend_requested &&
          !obj.is_friend_blocked,
      }));
      console.log('newDatingData => ', newDatingData)
      this.datings = this.page == 1 ? newDatingData : [...this.datings, ...newDatingData];
    }
    this.all_datings = this.datings; //[...this.datings];

    this.loading = false;
    console.log('Here Datings getData com', this.datings);
  }

  getAge(dob: any) {
    let date = new Date(dob);
    let now = new Date();
    const years = Math.abs(now.getFullYear() - date.getFullYear());
    return years;
  }

}
