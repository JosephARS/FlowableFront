import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioGestionComponent } from './formulario-gestion.component';

describe('FormularioGestionComponent', () => {
  let component: FormularioGestionComponent;
  let fixture: ComponentFixture<FormularioGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
