import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccnprefixComponent } from './accnprefix.component';

describe('AccnprefixComponent', () => {
  let component: AccnprefixComponent;
  let fixture: ComponentFixture<AccnprefixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccnprefixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccnprefixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
