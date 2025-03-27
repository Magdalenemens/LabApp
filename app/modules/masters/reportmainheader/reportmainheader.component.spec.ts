import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportmainheaderComponent } from './reportmainheader.component';

describe('ReportmainheaderComponent', () => {
  let component: ReportmainheaderComponent;
  let fixture: ComponentFixture<ReportmainheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportmainheaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportmainheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
