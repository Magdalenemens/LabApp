import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePicturesComponent } from './slide-pictures.component';

describe('SlidePicturesComponent', () => {
  let component: SlidePicturesComponent;
  let fixture: ComponentFixture<SlidePicturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidePicturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
