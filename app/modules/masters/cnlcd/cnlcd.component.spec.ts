import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnlcdComponent } from './cnlcd.component';

describe('CnlcdComponent', () => {
  let component: CnlcdComponent;
  let fixture: ComponentFixture<CnlcdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnlcdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CnlcdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
