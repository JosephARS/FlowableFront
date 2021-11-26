import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramaRenderComponent } from './diagrama-render.component';

describe('DiagramaRenderComponent', () => {
  let component: DiagramaRenderComponent;
  let fixture: ComponentFixture<DiagramaRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramaRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramaRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
