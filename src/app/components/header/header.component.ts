import { Component, Injector, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Platform, ViewWillEnter } from '@ionic/angular';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { NavService } from 'src/app/services/basic/nav.service';
import { PusherService } from 'src/app/services/pusher-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent extends BasePage implements OnInit {
  @Input() title = '';
  @Input() searchVisible = false;
  @Input() back = true;
  @Input() showcurve = true;
  @Input() showMenu = false;
  @Input() profileVisible = true;
  @Input() showCart = true;
  @Input() showSearch = true;
  @Input() shouldCallApi = true;
  @Input() shouldCallApii = true;

  @Input() showLoginInfo = true;

  cart_count;
  notifications_count: 0;
  // search_text;
  isSearchVisible = false;
  user_image;

  search_text: string;
  @Output() searchTextChange = new EventEmitter<string>();


  total_found = 0;
  first_selected = false;
  static instances = [];
  isIOS = false;
  skip_tags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A'];

  constructor(public nav: NavService, injector: Injector, pusher: PusherService, platform: Platform,
    private ref: ChangeDetectorRef) {
    super(injector);
  }

  ngOnInit() {
    HeaderComponent.instances.push(this);
    if (!this.user_image && this.showLoginInfo) this.getUser();
    this.events.subscribe('USER_DATA_RECEIVED', () => {
      this.showLoginInfo && this.getUser();
    });
    this.events.subscribe('ROUTE_CHANGED', () => {
      this.init();
    });
    this.init();
    this.isIOS = this.platform.is('ios');
    console.log('platform => ', this.isIOS)

    this.ref.detectChanges();
  }

  async init() {
    let token = localStorage.getItem('token');
    if (token && token != '1') {
      // const res = await this.network.getCart();
      // console.log('getCart', res);
      // HeaderComponent.instances.forEach((instance) => {
      //   instance.cart_count = res.data?.data[0]?.qty?.substring(0, 1) ?? 0;
      // });




      const localnotification = JSON.parse(localStorage.getItem('notifications_count')) || 0;
      if (localnotification == null) localStorage.setItem('notifications_count', '0');
      this.notifications_count = localnotification == null ? 0 : JSON.parse(localStorage.getItem('notifications_count'));
      console.log('this.notifications_count => ', this.notifications_count);

      // const noticount = await this.network.getUnreadNotificationCount();
      // console.log('noticount => ', noticount.data.count)
      // if (noticount.data.count) {
      //   localStorage.setItem('notifications_count', noticount.data.count.toString());
      //   this.notifications_count = noticount.data.count;
      // }

      window.addEventListener('storageChange', function (e) {
        console.log('e => ', e)
        this.notifications_count = JSON.parse(localStorage.getItem('notifications_count'));
        console.log('this.notifications_count event => ', this.notifications_count);
        HeaderComponent.instances.forEach((instance) => {
          instance.notifications_count = JSON.parse(localStorage.getItem('notifications_count'));
        });
        // Handle the storage change event here 
      });

      window.addEventListener('profilePicUpdated', (e) => {
        console.log('header profilePicUpdated => ')
        this.showLoginInfo && this.getUser();
      })

      // this.storage.get('notifications_count').then(data => {
      //   if (!data) {
      //     this.storage.set('notifications_count', 0)
      //   } else {
      //     console.log('async notification => ', data)
      //     this.notifications_count = data;
      //   }
      // })

    }
  }


  async getUser() {

    // let user = JSON.parse(localStorage.getItem('user'));
    // console.log('header user => ', user)
    // if (user?.profile_image) this.user_image = this.image.getImageUrl(user?.profile_image);
    // HeaderComponent.instances.forEach((instance) => {
    //   instance.user_image = this.user_image;
    // });

    // if (!this.shouldCallApi == !this.shouldCallApii) {
    //   return;
    // };


    // console.log('here => ')
    // this.users.userprofile.subscribe(user => {
    //   console.log('eidt profile this.users.userprofile => ', user)
    //   if (user) {
    //     this.user_image = user['profile_image'];
    //     if (user['profile_image'] && user['profile_image'] !== '') {
    //       HeaderComponent.instances.forEach((instance) => {
    //         // if (!user['profile_image'].includes('storage/uploads')) {
    //         //   console.log('storage/uploads')
    //         //   instance.user_image = this.image.getImageUrl(user['profile_image']);
    //         // } else {
    //         instance.user_image = user['profile_image'];
    //         // }
    //       });
    //     }
    //   }
    //   // else
    //   //   this.utility.presentFailureToast('Something went wrong');
    // })

    console.log('this.showLoginInfo => ', this.showLoginInfo)

    let user = await this.users.getUser();
    console.log('header getUser => ', user);
    if (user) {
      this.cart_count = user.cart?.quantity || 0
      // this.user_image = user['profile_image'];
      console.log('header this.user_image => ', this.user_image);
      // if (user['profile_image'] && user['profile_image'] !== '') {
      HeaderComponent.instances.forEach((instance) => {
        // console.log('instance => ', instance)

        if (user['profile_image'] && user['profile_image'] !== '' && !user['profile_image'].includes('storage/uploads')) {
          // console.log('storage/uploads')
          instance.user_image = this.image.getImageUrl(user['profile_image']);
        } else {
          // console.log('not storage/uploads')
          instance.user_image = user['profile_image'];
        }
      });
      // }
    } else
      this.utility.presentFailureToast('Something went wrong');
  }

  async goBack() {
    let isModalExist = await this.modals.isModalOpen();
    if (isModalExist) this.modals.dismiss({});
    else this.nav.pop();
  }

  gotoProfile() {
    this.users.getUser().then((user) => {
      this.nav.navigateTo('pages/profile', {
        queryParams: { user_id: user.id },
      });
    });
  }

  gotoDashboard() {
    this.users.getUser().then((user) => {
      this.nav.navigateTo('pages/dashboard', {
        queryParams: { user_id: user.id },
      });
    });
  }

  gotoNotifications() {
    this.nav.push('pages/notifications');
  }

  gotoCart() {
    if (
      this.cart_count &&
      this.cart_count !== '' &&
      this.cart_count.substring(0, 1) !== '0'
    )
      this.nav.push('pages/cart');
  }

  toggleMenu() {
    console.log('toggleMenu');
    if (!this.menuCtrl.isEnabled('main')) this.menuCtrl.enable(true, 'main');

    this.menuCtrl.toggle();
    this.events.publish('DRAWER_OPENED');
  }

  onTextChanged($event) {
    let search = $event.target.value;
    console.log(search);
    this.search_text = search;
    this.search();
    //this.dataService.searchValueChanged.next(search);
  }

  searchNow() {
    console.log(this.search_text);
    this.search();
  }

  searchClicked() {
    if (this.isSearchVisible) {
      this.search_text = '';
      this.search();
    }
    this.isSearchVisible = !this.isSearchVisible;
  }

  search() {

    this.searchTextChange.emit(this.search_text);
    const currentRoute = this.nav.router.url;
    console.log('Current Active Route:', currentRoute);
    // if (currentRoute != '/pages/how-to') {
    this.first_selected = false;
    this.removeHighlight();
    if (this.search_text.trim() === '') return;
    const allTags = document.querySelectorAll('body *');
    allTags.forEach((tag) => {
      if (
        (tag.tagName === 'SPAN' && tag.classList.contains('highlight')) ||
        (tag.children.length > 0 && this.skip_tags.indexOf(tag.tagName) < 0) ||
        tag.innerHTML.length < 1
      ) {
      } else this.searchAndHighlightTag(tag);
    });
    // }

    // if (currentRoute == '/pages/how-to' || currentRoute == '/pages/equipment-reviews-list') {
    //   const allCards = document.querySelectorAll('.searchcard');
    //   allCards.forEach(card => {
    //     const highlightElement = card.querySelector('.highlight');
    //     if (highlightElement) {
    //       // card.style.display = 'block';
    //       card.classList.remove('hidecard');
    //     } else {
    //       // card.style.display = 'none';
    //       card.classList.add('hidecard');
    //     }
    //   });
    // }

  }

  searchAndHighlightTag = (tag) => {


    if (tag.hasAttribute('data-hl-text')) {
      tag.innerHTML = decodeURI(tag.getAttribute('data-hl-text'));
    }
    const search_text = this.search_text;

    const search = search_text.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    if (tag.childNodes.length < 2) {
      const matches = [...tag.textContent.matchAll(new RegExp(search, 'gi'))];
      this.total_found += matches.length;
      if (matches.length > 0) {
        tag.setAttribute('data-hl-text', encodeURI(tag.innerHTML));
        // if (!this.first_selected) {

        const currentRoute = this.nav.router.url;
        if (currentRoute != '/pages/how-to' && currentRoute != '/pages/equipment-reviews-list') {
          console.log('Scrolling');
          tag.scrollIntoView({ behavior: 'smooth' });
        }
        if (currentRoute == '/pages/how-to' || currentRoute == '/pages/equipment-reviews-list') {
          if (currentRoute == '/pages/equipment-reviews-list') {
            const allTags = document.querySelectorAll('.searchcardeq');
            this.total_found = allTags.length;
          } else if (currentRoute == '/pages/how-to') {
            const allTags = document.querySelectorAll('.searchcard');
            this.total_found = allTags.length;
          }
          return;
        }


        this.first_selected = true;
        //  }
        for (const match of matches) {
          if (!tag.classList.contains('UNMATCHED')) {
            tag.innerHTML =
              tag.textContent.substring(0, match.index) +
              "<span class='highlight'>" +
              tag.textContent.substring(
                match.index,
                match.index + search_text.length
              ) +
              '</span>' +
              tag.textContent.substring(match.index + search_text.length);
          }
        }
      }
    } else {
      for (const childNode of tag.childNodes) {
        if (childNode.nodeName === '#text') {
          const matches = [
            ...childNode.nodeValue.matchAll(new RegExp(search, 'gi')),
          ];
          this.total_found += matches.length;
          if (matches.length > 0) {
            const hlElm = document.createElement('highlight-txt');
            hlElm.innerHTML = childNode.nodeValue;
            hlElm.setAttribute('data-hl-text', encodeURI(hlElm.innerHTML));
            for (const match of matches) {
              hlElm.innerHTML =
                hlElm.textContent.substring(0, match.index) +
                "<span class='highlight'>" +
                hlElm.textContent.substring(
                  match.index,
                  match.index + search_text.length
                ) +
                '</span>' +
                hlElm.textContent.substring(match.index + search_text.length);
            }
            tag.replaceChild(hlElm, childNode);
            if (!this.first_selected) {
              tag.scrollIntoView({ behavior: 'smooth' });
              this.first_selected = true;
            }
          }
        }
      }
    }
  };

  removeHighlight() {
    this.total_found = 0;
    const highlighted = document.querySelectorAll('body span.highlight');

    highlighted.forEach((el: any) => {
      if (el.parentNode.hasAttribute('data-hl-text')) {
        el.parentNode.innerHTML = decodeURI(
          el.parentNode.getAttribute('data-hl-text')
        );
      }
    });
  }
}
