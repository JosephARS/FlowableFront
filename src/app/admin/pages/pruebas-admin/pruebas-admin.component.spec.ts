import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasAdminComponent } from './pruebas-admin.component';

describe('PruebasAdminComponent', () => {
  let component: PruebasAdminComponent;
  let fixture: ComponentFixture<PruebasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebasAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
