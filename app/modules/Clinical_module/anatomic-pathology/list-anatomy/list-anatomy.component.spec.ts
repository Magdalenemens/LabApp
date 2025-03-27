import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnatomyComponent } from './list-anatomy.component';

describe('ListAnatomyComponent', () => {
  let component: ListAnatomyComponent;
  let fixture: ComponentFixture<ListAnatomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAnatomyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAnatomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
