import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEntryComponent } from './test-entry.component';

describe('TestEntryComponent', () => {
  let component: TestEntryComponent;
  let fixture: ComponentFixture<TestEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
