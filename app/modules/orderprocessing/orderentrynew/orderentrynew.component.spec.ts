import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderentrynewComponent } from './orderentrynew.component';

describe('OrderentrynewComponent', () => {
  let component: OrderentrynewComponent;
  let fixture: ComponentFixture<OrderentrynewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderentrynewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderentrynewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
