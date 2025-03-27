import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestDirectoryComponent } from './add-test-directory.component';

describe('AddTestDirectoryComponent', () => {
  let component: AddTestDirectoryComponent;
  let fixture: ComponentFixture<AddTestDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTestDirectoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTestDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
