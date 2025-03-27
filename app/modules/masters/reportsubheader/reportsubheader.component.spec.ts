import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsubheaderComponent } from './reportsubheader.component';

describe('ReportsubheaderComponent', () => {
  let component: ReportsubheaderComponent;
  let fixture: ComponentFixture<ReportsubheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsubheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsubheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
