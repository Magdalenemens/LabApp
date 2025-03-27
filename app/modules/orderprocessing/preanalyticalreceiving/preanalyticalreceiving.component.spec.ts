import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreAnalyticalReceivingComponent } from './preanalyticalreceiving.component';

describe('OrderentryComponent', () => {
  let component: PreAnalyticalReceivingComponent;
  let fixture: ComponentFixture<PreAnalyticalReceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAnalyticalReceivingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreAnalyticalReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
