import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnatomicPathologyComponent } from './anatomic-pathology.component';

 

describe('AnatomicPathologyComponent', () => {
  let component: AnatomicPathologyComponent;
  let fixture: ComponentFixture<AnatomicPathologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnatomicPathologyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnatomicPathologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
