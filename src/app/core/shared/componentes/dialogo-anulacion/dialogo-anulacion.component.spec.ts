import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAnulacionComponent } from './dialogo-anulacion.component';

describe('DialogoAnulacionComponent', () => {
  let component: DialogoAnulacionComponent;
  let fixture: ComponentFixture<DialogoAnulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoAnulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
