import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralresultsComponent } from './generalresults.component';

describe('GeneralresultsComponent', () => {
  let component: GeneralresultsComponent;
  let fixture: ComponentFixture<GeneralresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralresultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
