import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Analisis } from 'src/app/core/modelos/analisis';
import { AuthService } from 'src/app/core/servicios/http/auth.service';
import { HistorialAnalisisService } from 'src/app/core/servicios/http/historial-analisis.service';


@Component({
  selector: 'app-historial-analisis',
  templateUrl: './historial-analisis.component.html',
  styleUrls: ['./historial-analisis.component.scss']
})
export class HistorialAnalisisComponent implements OnInit, OnChanges {

  idUsuarioLoggeado: string;

  displayedColumns: string[] = ["tipoAnalisis","fechaAnalisis","estadoAnalisis","usuario","comentario"];
  dataSource: any = [];

  tipoAnalisisArr: string[] = ['Análisis médico', 'Análisis UIFA', ' Línea Personalizada', 'Asistencia Bolivar'];
  estadosArr: string[] = ['Pendiente', 'En proceso', 'Finalizado'];

  mostrarFormulario:boolean;
  procesando: boolean;

  analisisForm = this.formBuilder.group({
    tipoAnalisis: ['', Validators.required],
    usuario: [{ value: "", disabled: true }],
    estadoAnalisis:['', Validators.required],
    comentario:['', Validators.required]
  });

  oAnalisis = new Analisis();

  @Input() historial: Analisis[];
  @Input() idProceso: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private historialAnalisisService: HistorialAnalisisService) {

    this.mostrarFormulario = false;
    this.idUsuarioLoggeado = this.authService.username;
    this.analisisForm.controls.usuario.setValue(this.idUsuarioLoggeado);
    this.procesando = false;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges){
    this.analisisForm.reset({tipoAnalisis:'', estadoAnalisis:'', comentario:''});
    this.mostrarFormulario = false;
    this.dataSource = new MatTableDataSource<any>(this.historial);
    console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(this.historial);
  }

  OnClickAgregar(){
    this.mostrarFormulario = true;
    console.log("BBBB");
  }

  guardarAnalisis(){

    console.log(this.analisisForm.value)
    console.log(this.idUsuarioLoggeado)
    if(!this.analisisForm.invalid){
      this.oAnalisis.tipoAnalisis = this.analisisForm.value.tipoAnalisis;
      this.oAnalisis.estadoAnalisis = this.analisisForm.value.estadoAnalisis;
      this.oAnalisis.fechaAnalisis = new Date();
      this.oAnalisis.usuario = this.idUsuarioLoggeado;
      this.oAnalisis.comentario = this.analisisForm.value.comentario;
      console.log(this.oAnalisis);
      this.procesando = true;
      this.historialAnalisisService.putAgregarAnalisis(this.idProceso, this.oAnalisis).subscribe(data => {
        if (data.tipoRespuesta === "Exito") {
          this.mostrarFormulario = false;
          this.analisisForm.reset();
          this.abrirSnackBar(data.mensaje);
          let analisisNew: object;
          analisisNew = JSON.parse(JSON.stringify(this.oAnalisis));
          console.log(analisisNew);
          let analisisAgregar = [];
          if(this.dataSource.data != null){
            analisisAgregar =  this.dataSource.data.concat(analisisNew);
          }else{
            analisisAgregar.push(analisisNew);
          }
          this.dataSource = new MatTableDataSource<any>(analisisAgregar);
          console.log(this.dataSource.data);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
        this.procesando = false;
      });
    }
  }


  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 10000;
    config.verticalPosition = "top";
    config.panelClass = ['red-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }
}
