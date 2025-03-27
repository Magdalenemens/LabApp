import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOrderentryComponent } from './add-orderentry.component';



describe('OrderentryComponent', () => {
  let component: AddOrderentryComponent;
  let fixture: ComponentFixture<AddOrderentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrderentryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrderentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
