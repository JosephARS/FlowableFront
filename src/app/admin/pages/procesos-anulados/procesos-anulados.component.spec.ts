import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosAnuladosComponent } from './procesos-anulados.component';

describe('ProcesosAnuladosComponent', () => {
  let component: ProcesosAnuladosComponent;
  let fixture: ComponentFixture<ProcesosAnuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosAnuladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosAnuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
