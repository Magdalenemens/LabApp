import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountmanagersComponent } from './accountmanagers.component';

describe('AccountmanagersComponent', () => {
  let component: AccountmanagersComponent;
  let fixture: ComponentFixture<AccountmanagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountmanagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountmanagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
