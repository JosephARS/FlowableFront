import { TestBed } from '@angular/core/testing';

import { HistorialAnalisisService } from './historial-analisis.service';

describe('HistorialAnalisisService', () => {
  let service: HistorialAnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialAnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
