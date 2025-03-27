import { Component, Renderer2  } from '@angular/core';

@Component({
  selector: 'app-customer-quotation',
  templateUrl: './customer-quotation.component.html',
  styleUrls: ['./customer-quotation.component.scss']
})
export class CustomerQuotationComponent {
  isCardVisible: boolean = false;
  cardPosition = { top: 0, left: 0 };

  constructor(private renderer: Renderer2) {}

  showCard(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Ensure card is placed on the right side of the clicked "CBC" cell
    this.cardPosition = {
      top: rect.top + window.scrollY,
      left: rect.right + 10 // Adjust the left position to be next to the cell
    };

    // Show the card
    this.isCardVisible = true;
  }

  hideCard(): void {
    this.isCardVisible = false;
  }

  save(): void {
    // Your save logic
    console.log('Save button clicked');
    this.hideCard();
  }
}
