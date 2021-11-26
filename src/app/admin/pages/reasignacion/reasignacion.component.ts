import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaAbierta } from 'src/app/core/modelos/tarea-abierta';
import { Usuario } from 'src/app/core/modelos/usuario';
import { HomeService } from 'src/app/core/servicios/http/home.service';
import { UsuariosService } from 'src/app/core/servicios/http/usuarios.service';
import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

import { DialogoConfirmacionComponent } from '../../../core/shared/componentes/dialogo-confirmacion/dialogo-confirmacion.component';

@Component({
  selector: 'app-reasignacion',
  templateUrl: './reasignacion.component.html',
  styleUrls: ['./reasignacion.component.scss']
})
export class ReasignacionComponent implements OnInit {



  parametrosBusqueda: string[];
  parametroSeleccionado: string;
  valorBusqueda: string;
  nombreTarea: string;
  tareaSeleccionada:TareaAbierta;
  procesoSeleccionado: String;

  displayedColumns: string[] = ['idConsecutivo', 'nombreTarea', 'fechaCreacion', 'fechaSolucion', 'tiempoSolucion', 'reasignar'];
  dataSource = new MatTableDataSource<any>();

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];

  pageEvent: PageEvent;
  HighlightRow: number;
  procesando = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  usuariosAsignables: Usuario[];
  usuarioSeleccionado: Usuario;

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private homeService: HomeService,
              private router: Router,
              private flujosIndemnizacionesService: FlujosIndemnizacionesService,
              private usuariosService:UsuariosService,
              public dialogoConfirmacion: MatDialog) {
    this.parametrosBusqueda = ['Consecutivo','Número de siniestro','Número de documento', 'Responsable'];
    this.parametroSeleccionado ='';
    this.valorBusqueda = '';
    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];
    this.nombreTarea = 'Todas';
  }

  ngOnInit(): void {
  }

  onClickBuscar(){
    console.log(this.parametroSeleccionado, this.valorBusqueda)
    this.usuariosAsignables = null;
    this.HighlightRow=null;
    this.dataSource = new MatTableDataSource<any>();
    if(this.parametroSeleccionado==='' || this.valorBusqueda===''){
      this.abrirSnackBar("Se requiere un parametro y un dato para iniciar búsqueda");
    }else{
      let primerItem = 0;
      this.procesando = true;
      console.log(this.valorBusqueda);
      this.flujosIndemnizacionesService.getTareasUsuario(this.valorBusqueda, this.nombreTarea, this.itemPorPagina, primerItem).subscribe(data => {
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatos = data.totalItems;
          this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
          this.dataSource.paginator = this.paginator;
          console.log(data);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
        this.procesando = false;
        });
    }
  }

  public getPagina(event:PageEvent){
    //this.pageEvent=event;
    if(event.pageSize <= this.totalDatos){
      this.HighlightRow=null;
      let cantidadItems = event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * cantidadItems) ;
      }

      this.homeService.getBusqueda(this.parametroSeleccionado, this.valorBusqueda, this.itemPorPagina, primerItem).subscribe(data => {
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatos = data.totalItems;
          this.dataSource = new MatTableDataSource<any>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
      });

    }
  }

  onProcesoSeleccionado(tarea: TareaAbierta,  index: any){
    this.HighlightRow = index;
    this.procesoSeleccionado = '';
    this.procesoSeleccionado = tarea.idProceso;
    this.tareaSeleccionada = tarea;

    this.usuariosService.getListarUsuarios(tarea.idTareaDefinicion).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.usuariosAsignables = data.listaResultado;
        this.usuariosAsignables = this.usuariosAsignables.filter( usuario => usuario.loginUsuario!=this.valorBusqueda)
      }else{
        this.abrirSnackBar(data.mensaje);
      }
    })

  }

  onClickAceptar(){
    console.log(this.usuarioSeleccionado.loginUsuario);
    this.dialogoConfirmacion
    .open(DialogoConfirmacionComponent, {
      data: `¿Desea reasignar la tarea ${this.tareaSeleccionada.nombreTarea} al usuario ${this.usuarioSeleccionado.loginUsuario}?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.procesando = true;
        this.usuariosService.putReasignarUsuario(this.tareaSeleccionada.idProceso, this.usuarioSeleccionado.loginUsuario, this.tareaSeleccionada.idTarea).subscribe(data => {
          console.log(data);
          if (data.tipoRespuesta == 'Exito') {
            //let dataSourceFiltro = this.dataSource.data.filter(item => item.idProceso !== this.tareaSeleccionada.idProceso);
            let dataSourceFiltro = this.dataSource.data.splice(this.HighlightRow,1);
            this.dataSource = new MatTableDataSource<any>(dataSourceFiltro);
            this.totalDatos = this.totalDatos -1;
            this.usuariosAsignables = null;
            this.abrirSnackBar("Tarea reasignada exitosamente");
          }else{
            this.abrirSnackBar(data.mensaje);
          }
          this.procesando = false;
        });
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
