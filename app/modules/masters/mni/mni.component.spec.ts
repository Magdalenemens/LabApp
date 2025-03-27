import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MniComponent } from './mni.component';

describe('MniComponent', () => {
  let component: MniComponent;
  let fixture: ComponentFixture<MniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
