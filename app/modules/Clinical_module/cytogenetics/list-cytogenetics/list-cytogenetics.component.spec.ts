import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCytogeneticsComponent } from './list-cytogenetics.component';

describe('ListCytogeneticsComponent', () => {
  let component: ListCytogeneticsComponent;
  let fixture: ComponentFixture<ListCytogeneticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCytogeneticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCytogeneticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
