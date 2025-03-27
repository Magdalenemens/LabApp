import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CytogeneticsComponent } from './cytogenetics.component';

describe('CytogeneticsComponent', () => {
  let component: CytogeneticsComponent;
  let fixture: ComponentFixture<CytogeneticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CytogeneticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CytogeneticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
