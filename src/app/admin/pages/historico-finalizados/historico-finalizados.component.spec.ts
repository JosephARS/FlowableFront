import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoFinalizadosComponent } from './historico-finalizados.component';

describe('HistoricoFinalizadosComponent', () => {
  let component: HistoricoFinalizadosComponent;
  let fixture: ComponentFixture<HistoricoFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoFinalizadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
