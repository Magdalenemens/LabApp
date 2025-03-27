import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderReceivingComponent } from './order-receiving.component';

describe('OrderentryComponent', () => {
  let component: OrderReceivingComponent;
  let fixture: ComponentFixture<OrderReceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReceivingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
