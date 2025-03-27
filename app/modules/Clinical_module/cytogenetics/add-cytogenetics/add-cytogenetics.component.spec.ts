import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCytogeneticsComponent } from './add-cytogenetics.component';

describe('AddCytogeneticsComponent', () => {
  let component: AddCytogeneticsComponent;
  let fixture: ComponentFixture<AddCytogeneticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCytogeneticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCytogeneticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
