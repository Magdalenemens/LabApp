import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteTestsListsComponent } from './site-tests-lists.component';

describe('SiteTestsListsComponent', () => {
  let component: SiteTestsListsComponent;
  let fixture: ComponentFixture<SiteTestsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteTestsListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteTestsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
