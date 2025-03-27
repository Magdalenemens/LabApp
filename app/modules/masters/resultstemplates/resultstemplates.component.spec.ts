import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultstemplatesComponent } from './resultstemplates.component';

describe('ResultstemplatesComponent', () => {
  let component: ResultstemplatesComponent;
  let fixture: ComponentFixture<ResultstemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultstemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultstemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
