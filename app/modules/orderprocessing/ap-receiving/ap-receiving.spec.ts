import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnatomicPathologyReceivingComponent } from './ap-receiving.component.';

 
describe('AnatomicPathologyReceivingComponent', () => {
  let component: AnatomicPathologyReceivingComponent;
  let fixture: ComponentFixture<AnatomicPathologyReceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnatomicPathologyReceivingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnatomicPathologyReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
