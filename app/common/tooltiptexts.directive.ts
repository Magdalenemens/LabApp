import { Directive, HostListener, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltiptextDirective {
  @Input('appTooltip') tooltipText: string;
  private tooltipElement: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

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
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    this.tooltipElement = this.renderer.createElement('span');
    const text = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    this.renderer.addClass(this.tooltipElement, 'tooltip-text-large');
    
    // Set position
    const tooltipPos = this.tooltipElement.getBoundingClientRect();
    const top = hostPos.bottom;
    const left = hostPos.left + (hostPos.width / 2) - (tooltipPos.width / 2);

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.el.nativeElement.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
