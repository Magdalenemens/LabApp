import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialpricesComponent } from './specialprices.component';

describe('SpecialpricesComponent', () => {
  let component: SpecialpricesComponent;
  let fixture: ComponentFixture<SpecialpricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialpricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialpricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
