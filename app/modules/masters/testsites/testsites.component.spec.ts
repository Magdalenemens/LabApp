import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsitesComponent } from './testsites.component';

describe('TestsitesComponent', () => {
  let component: TestsitesComponent;
  let fixture: ComponentFixture<TestsitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
