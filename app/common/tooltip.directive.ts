import { Directive, HostListener, Input, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input() tooltip: string;
  private tooltipElement: HTMLElement;

  constructor(private el: ElementRef) {}

  @HostListener('mouseover')
  onHover() {
    if (!this.tooltipElement) {
      this.createTooltip();
    }
  }

  @HostListener('mouseleave')
  onLeave() {
    this.removeTooltip();
  }

  private createTooltip() {
    this.tooltipElement = document.createElement('span');
    this.tooltipElement.textContent = this.tooltip;
    this.tooltipElement.className = 'tooltip-text';
    this.el.nativeElement.appendChild(this.tooltipElement);
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.el.nativeElement.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
