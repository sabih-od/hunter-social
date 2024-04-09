import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoriesAvatarSliderComponent } from './stories-avatar-slider.component';

describe('StoriesAvatarSliderComponent', () => {
  let component: StoriesAvatarSliderComponent;
  let fixture: ComponentFixture<StoriesAvatarSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesAvatarSliderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoriesAvatarSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
