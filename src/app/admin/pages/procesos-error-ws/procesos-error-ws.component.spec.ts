import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosErrorWSComponent } from './procesos-error-ws.component';

describe('ProcesosErrorWSComponent', () => {
  let component: ProcesosErrorWSComponent;
  let fixture: ComponentFixture<ProcesosErrorWSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosErrorWSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosErrorWSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
