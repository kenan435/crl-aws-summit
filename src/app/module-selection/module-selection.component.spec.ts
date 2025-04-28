import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleSelectionComponent } from './module-selection.component';

describe('ModuleSelectionComponent', () => {
  let component: ModuleSelectionComponent;
  let fixture: ComponentFixture<ModuleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModuleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
