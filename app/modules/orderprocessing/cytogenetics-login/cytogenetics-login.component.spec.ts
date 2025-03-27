import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CytogeneticsLoginComponent } from './cytogenetics-login.component';

describe('CytogeneticsLoginComponent', () => {
  let component: CytogeneticsLoginComponent;
  let fixture: ComponentFixture<CytogeneticsLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CytogeneticsLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CytogeneticsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
