import { Directive, Output, EventEmitter, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
// import { HammerGestureConfig, HammerGestureConfigToken } from '@angular/platform-browser';
import { Gesture, GestureController } from '@ionic/angular';

@Directive({
  selector: '[swipe-vertical]' // Attribute selector
})
export class SwipeVerticalDirective implements OnInit, OnDestroy {
  @Output() onSwipeUp = new EventEmitter();
  @Output() onSwipeDown = new EventEmitter();
  private swipeGesture: Gesture;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    this.swipeGesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      gestureName: 'swipe-vertical',
      threshold: 0,
      direction: 'y',
      onStart: () => {},
      onMove: () => {},
      onEnd: (ev) => {
        if (ev.deltaY < 0) {
          this.renderer.setProperty(this.el.nativeElement, 'style', 'transition: transform 0.3s ease-in-out; transform: translateY(-100%);');
          this.onSwipeUp.emit({ el: this.el.nativeElement });
        } else {
          this.renderer.setProperty(this.el.nativeElement, 'style', 'transition: transform 0.3s ease-in-out; transform: translateY(100%);');
          this.onSwipeDown.emit({ el: this.el.nativeElement });
        }
      }
    });

    this.swipeGesture.enable(true);
  }

  ngOnDestroy() {
    this.swipeGesture.destroy();
  }
}



// import { Directive, Output, EventEmitter, ElementRef } from '@angular/core';
// import { Gesture } from '@ionic/angular';

// declare var Hammer: any;

// @Directive({
//   selector: '[swipe-vertical]' // Attribute selector
// })
// export class SwipeVerticalDirective {
//   @Output() onSwipeUp = new EventEmitter();
//   @Output() onSwipeDown = new EventEmitter();
//   private el: HTMLElement;
//   private swipeGesture: Gesture;

//   constructor(el: ElementRef) {
//     this.el = el.nativeElement;
//   }

//   ngOnInit() {
//     this.swipeGesture = new Gesture(this.el, {
//       recognizers: [
//         [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]
//       ]
//     });

//     this.swipeGesture.listen();

//     this.swipeGesture.on("swipeup", () => {
//       this.onSwipeUp.emit({ el: this.el });
//     });

//     this.swipeGesture.on("swipedown", () => {
//       this.onSwipeDown.emit({ el: this.el });
//     });
//   }

//   ngOnDestroy() {
//     this.swipeGesture.destroy();
//   }
// }