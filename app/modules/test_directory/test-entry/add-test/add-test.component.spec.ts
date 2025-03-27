import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestEntryComponent } from './add-test.component';

describe('AddTestEntryComponent', () => {
  let component: AddTestEntryComponent;
  let fixture: ComponentFixture<AddTestEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTestEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
