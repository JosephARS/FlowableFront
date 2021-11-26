import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCasoComponent } from './historial-caso.component';

describe('HistorialCasoComponent', () => {
  let component: HistorialCasoComponent;
  let fixture: ComponentFixture<HistorialCasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialCasoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
