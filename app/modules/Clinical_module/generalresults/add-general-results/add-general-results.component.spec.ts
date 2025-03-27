import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeneralResultsComponent } from './add-general-results.component';

describe('AddGeneralResultsComponent', () => {
  let component: AddGeneralResultsComponent;
  let fixture: ComponentFixture<AddGeneralResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGeneralResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGeneralResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
