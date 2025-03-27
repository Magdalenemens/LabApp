import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceRangesComponent } from './reference-ranges.component';

describe('ReferenceRangesComponent', () => {
  let component: ReferenceRangesComponent;
  let fixture: ComponentFixture<ReferenceRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceRangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
