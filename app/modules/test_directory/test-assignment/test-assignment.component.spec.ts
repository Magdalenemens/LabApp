import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAssignmentComponent } from './test-assignment.component';

describe('TestAssignmentComponent', () => {
  let component: TestAssignmentComponent;
  let fixture: ComponentFixture<TestAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
