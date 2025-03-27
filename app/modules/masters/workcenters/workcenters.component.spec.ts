import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterComponent } from './workcenters.component';

describe('WorkcenterComponent', () => {
  let component: WorkcentersComponent;
  let fixture: ComponentFixture<WorkcentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkcentersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkcentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
