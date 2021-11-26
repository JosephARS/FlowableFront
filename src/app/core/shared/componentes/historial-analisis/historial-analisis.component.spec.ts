import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAnalisisComponent } from './historial-analisis.component';

describe('HistorialAnalisisComponent', () => {
  let component: HistorialAnalisisComponent;
  let fixture: ComponentFixture<HistorialAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAnalisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
