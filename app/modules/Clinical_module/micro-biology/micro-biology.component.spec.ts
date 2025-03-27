import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroBiologyComponent } from './micro-biology.component';

describe('MicroBiologyComponent', () => {
  let component: MicroBiologyComponent;
  let fixture: ComponentFixture<MicroBiologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroBiologyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MicroBiologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
