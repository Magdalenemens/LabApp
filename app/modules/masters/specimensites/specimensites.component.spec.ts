import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecimensitesComponent } from './specimensites.component';

describe('SpecimensitesComponent', () => {
  let component: SpecimensitesComponent;
  let fixture: ComponentFixture<SpecimensitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecimensitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimensitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
