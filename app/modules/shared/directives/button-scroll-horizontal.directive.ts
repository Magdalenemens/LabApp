import { Directive,ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appButtonScrollHorizontal]',
  exportAs:"appButtonScrollHorizontal"
})
export class ButtonScrollHorizontalDirective {

  constructor(private elementRef: ElementRef) { }

  @Input() scrollUnit!: number;

  get isOverflow() {
    return this.elementRef.nativeElement.scrollWidth > this.elementRef.nativeElement.clientWidth;
  }

  scroll(direction: number) {
    this.elementRef.nativeElement.scrollLeft += this.scrollUnit * direction;
  }

  get canScrollStart() {
    return this.elementRef.nativeElement.scrollLeft > 0;
  }

  get canScrollEnd() {
    return this.elementRef.nativeElement.scrollLeft + this.elementRef.nativeElement.clientWidth != this.elementRef.nativeElement.scrollWidth;
  }

  @HostListener("window:resize")
  onWindowResize() {} 
}
