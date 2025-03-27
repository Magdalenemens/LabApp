import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMicrobiologyComponent } from './list-microbiology.component';

describe('ListMicrobiologyComponent', () => {
  let component: ListMicrobiologyComponent;
  let fixture: ComponentFixture<ListMicrobiologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMicrobiologyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMicrobiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
