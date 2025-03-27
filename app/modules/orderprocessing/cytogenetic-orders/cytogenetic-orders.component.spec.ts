import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CytogeneticOrdersComponent } from './cytogenetic-orders.component';

describe('CytogeneticOrdersComponent', () => {
  let component: CytogeneticOrdersComponent;
  let fixture: ComponentFixture<CytogeneticOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CytogeneticOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CytogeneticOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
