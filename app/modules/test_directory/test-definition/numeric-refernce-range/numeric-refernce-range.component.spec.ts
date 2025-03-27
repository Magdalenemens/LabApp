import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericRefernceRangeComponent } from './numeric-refernce-range.component';

describe('NumericRefernceRangeComponent', () => {
  let component: NumericRefernceRangeComponent;
  let fixture: ComponentFixture<NumericRefernceRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericRefernceRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericRefernceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
