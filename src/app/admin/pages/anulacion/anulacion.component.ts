import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DatosAnulacion } from 'src/app/core/modelos/datosAnulacion';
import { Proceso } from 'src/app/core/modelos/proceso';
import { AnulacionService } from 'src/app/core/servicios/http/anulacion.service';
import { AuthService } from 'src/app/core/servicios/http/auth.service';
import { DialogoAnulacionComponent } from '../../../core/shared/componentes/dialogo-anulacion/dialogo-anulacion.component';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.scss']
})
export class AnulacionComponent implements OnInit {

  displayedColumns: string[] = ['idConsecutivo', 'idProceso', 'fechaInicio', 'identificacionCliente', 'numeroPoliza', 'UsuarioCreador', 'anular'];
  dataSource = new MatTableDataSource<any>();

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];
  identificacion: string;

  pageEvent!: PageEvent;
  listaProcesos: Proceso[];
  datosAnulacion: DatosAnulacion;
  HighlightRow=null;
  procesando:boolean;
  usuarioLoggeado:string = '';

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  identificacionControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private anulacionService: AnulacionService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private authService: AuthService,) {

    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];
    this.identificacion='';
    this.procesando = true;
  }

  ngOnInit(): void {
    this.usuarioLoggeado = this.authService.getLoggedInUserName();
    this.procesando = false;
  }

  anularProceso(datosAnulacion: DatosAnulacion, idProceso:string){
    this.procesando = true;
    this.anulacionService.deleteAnularProceso(datosAnulacion, idProceso).subscribe(data => {
      this.procesando = false;
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.abrirSnackBar(data.mensaje);
        this.dataSource = new MatTableDataSource<Proceso>();
      }else{
        this.abrirSnackBar(data.mensaje);
      }
    })

  }

  onBuscarProcesos(identificacion: string){
    let primerItem = 0;
    this.identificacion=identificacion;
    this.anulacionService.getProcesosAbiertos(this.identificacion, this.itemPorPagina, primerItem).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatos = data.totalItems;
        this.dataSource = new MatTableDataSource<Proceso>(data.listaResultado);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
    });

  }

  public getPagina(event:PageEvent){
    this.pageEvent=event;
    if(event.pageSize <= this.totalDatos){
      let cantidadItems =  event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * cantidadItems) ;
      }
      console.log(cantidadItems, primerItem);
      this.anulacionService.getProcesosAbiertos(this.identificacion, cantidadItems, primerItem).subscribe(data => {
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.HighlightRow=null;
          this.totalDatos = data.totalItems;
          this.dataSource = new MatTableDataSource<Proceso>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
      });
    }
  }

  abrirDialogo(proceso:Proceso, index: any) {
    console.log(proceso);
    const dialogo1 = this.dialog.open(DialogoAnulacionComponent, {
        width: '400px',
      data: new DatosAnulacion()
    });

    dialogo1.afterClosed().subscribe(respuesta => {
      console.log(respuesta);
      console.log(dialogo1);
      let oDatosAnulacion = new DatosAnulacion();
      oDatosAnulacion = respuesta;
      if (oDatosAnulacion != undefined){
        oDatosAnulacion.usuario = this.usuarioLoggeado;
        console.log("Ingresaaaaa" +oDatosAnulacion);
        this.anularProceso(oDatosAnulacion, proceso.idProceso);
      }
    });
  }


  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }

}

