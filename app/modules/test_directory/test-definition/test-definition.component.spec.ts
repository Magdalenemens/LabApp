import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDefinitionComponent } from './test-definition.component';

describe('TestDefinitionComponent', () => {
  let component: TestDefinitionComponent;
  let fixture: ComponentFixture<TestDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDefinitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
