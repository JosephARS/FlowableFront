import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatosAnulacion } from 'src/app/core/modelos/datosAnulacion';

@Component({
  selector: 'app-dialogo-anulacion',
  templateUrl: './dialogo-anulacion.component.html',
  styleUrls: ['./dialogo-anulacion.component.scss']
})
export class DialogoAnulacionComponent implements OnInit {

  opcionesAnulacion = ['Desistimiento', 'Datos erroneos', 'Caso duplicado', 'Otro' ];

  constructor(
    public dialogRef: MatDialogRef<DialogoAnulacionComponent>,
    @ Inject(MAT_DIALOG_DATA) public data: DatosAnulacion) {}

  ngOnInit() {
  }

  cancelar() {
    this.dialogRef.close();
  }

}
