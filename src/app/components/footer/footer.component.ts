import { Component, Injector, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base-page/base-page';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BasePage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }
  @Input() linksVisible = true;

  links;

  ngOnInit() {
    this.init();
  }

  init() {
    this.links = this.dataService.getFooterLinks();
  }
  navigate(page) {
    this.nav.push('pages/' + page);
  }
}
