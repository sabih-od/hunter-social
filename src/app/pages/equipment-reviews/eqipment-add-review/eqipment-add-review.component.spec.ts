import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EqipmentAddReviewComponent } from './eqipment-add-review.component';

describe('EqipmentAddReviewComponent', () => {
  let component: EqipmentAddReviewComponent;
  let fixture: ComponentFixture<EqipmentAddReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EqipmentAddReviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EqipmentAddReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
