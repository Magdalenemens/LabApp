import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeneralResultsComponent } from './list-general-results.component';

describe('ListGeneralResultsComponent', () => {
  let component: ListGeneralResultsComponent;
  let fixture: ComponentFixture<ListGeneralResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGeneralResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGeneralResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
