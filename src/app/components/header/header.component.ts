import { Component, Injector, Input, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { BasePage } from 'src/app/pages/base-page/base-page';
import { NavService } from 'src/app/services/basic/nav.service';

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

  cart_count;
  search_text;
  isSearchVisible = false;
  user_image;
 

  total_found = 0;
  first_selected = false;
  static instances = [];

  skip_tags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A'];

  constructor(public nav: NavService, injector: Injector) {
    super(injector);
  }

  ngOnInit() {

    HeaderComponent.instances.push(this);
    if (!this.user_image) this.getUser();
    this.events.subscribe('USER_DATA_RECEIVED', () => {
      this.getUser();
    });
    this.events.subscribe('ROUTE_CHANGED', () => {
      this.init();
    });
    this.init();
  }

  async init() {
    let token = localStorage.getItem('token');
    if (token && token != '1') {
      const res = await this.network.getCart();
      console.log('getCart', res);

      HeaderComponent.instances.forEach((instance) => {
        instance.cart_count = res.data?.data[0]?.qty?.substring(0, 1) ?? 0;
      });
    }
  }

  async getUser() {

    if(!this.shouldCallApi == !this.shouldCallApii){
      return;
    };
    


    let res = await this.network.getUser();
    console.log('getUser', res);
    if (res && res.data && res.data.user) {
      let user = res.data.user;
      if (user['profile_image'] && user['profile_image'] !== '') {
        HeaderComponent.instances.forEach((instance) => {
          instance.user_image = this.image.getImageUrl(user['profile_image']);
        });
      }
    } else
      this.utility.presentFailureToast(res?.message ?? 'Something went wrong');
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
        console.log('Scrolling');
        tag.scrollIntoView({ behavior: 'smooth' });
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
