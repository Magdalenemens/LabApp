import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnComponent } from './mn.component';

describe('MnComponent', () => {
  let component: MnComponent;
  let fixture: ComponentFixture<MnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
