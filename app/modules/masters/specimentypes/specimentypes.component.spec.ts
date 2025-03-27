import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecimentypesComponent } from './specimentypes.component';

describe('SpecimentypesComponent', () => {
  let component: SpecimentypesComponent;
  let fixture: ComponentFixture<SpecimentypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecimentypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimentypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
