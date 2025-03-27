import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListOrderentryComponent } from './list-orderentry.component';

describe('OrderentryComponent', () => {
  let component: ListOrderentryComponent;
  let fixture: ComponentFixture<ListOrderentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrderentryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOrderentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
