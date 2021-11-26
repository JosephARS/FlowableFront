import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TareaAbierta } from 'src/app/core/modelos/tarea-abierta';
import { FormularioGestionService } from 'src/app/core/servicios/components/formulario-gestion.service';
import { AuthService } from 'src/app/core/servicios/http/auth.service';

import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['idConsecutivo', 'nombreTarea', 'fechaCreacion', 'fechaSolucion', 'tiempoSolucion'];
  dataSource = new MatTableDataSource<TareaAbierta>();

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];

  pageEvent!: PageEvent;

  tiluloSeccion:string;
  idRutaActiva:string;
  usuarioActivo: string;
  estadoSeleccionado: string='';
  procesosFinalizados: boolean;
  parametroActivo: string;
  HighlightRow!: Number;
  tareaCompletada:boolean;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  suscripcion: Subscription;
  fechaActual: number;
  estadoTiempoSolu: string ='Vigente';
  procesando = false;


  constructor(private activatedRoute: ActivatedRoute,
              private flujosIndemnizacionesService: FlujosIndemnizacionesService,
              private formularioGestionService:FormularioGestionService,
              private snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService){
    this.usuarioActivo = this.authService.getLoggedInUserName();//authenticationService.getLoggedInUserName();

    //this.dataSource = new MatTableDataSource<TareaAbierta>();
    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];
    this.idRutaActiva = '';
    this.procesosFinalizados = false;
    this.tareaCompletada = false;

  }
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }



  ngOnInit(): void{
    this.fechaActual = new Date().getTime();
    this.actualizarListaTareas();
    console.log(this.router.url);
    this.activatedRoute.params.subscribe((params)=>{
      this.idRutaActiva = Object.keys(params)[0];
      console.log(Object.keys(params)[0]);
      this.procesando = true;
      if (this.idRutaActiva === 'estadoSeleccionado') {   //Mostrar las tareas a realizar por el usuario Logeado
        this.tiluloSeccion = 'Inbox > ' + params.estadoSeleccionado;
        this.estadoSeleccionado = params.estadoSeleccionado;
        let primerItem = 0;
        this.flujosIndemnizacionesService.getTareasUsuario(this.usuarioActivo, this.estadoSeleccionado, this.itemPorPagina, primerItem).subscribe(data => {
          if (data.tipoRespuesta == 'Exito') {
            this.totalDatos = data.totalItems;
            this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
            this.dataSource.paginator = this.paginator;
            console.log(this.estadoSeleccionado);
            console.log(data);
          }else{
            this.abrirSnackBar(data.mensaje);
          }
          this.procesando = false;
        });
      }else if (this.idRutaActiva === 'procesosFinalizados'){   //Mostrar todos los proceso ya finalizas o con tareas asignadas a usuarios
        this.tiluloSeccion = 'Procesos > ' + (params.procesosFinalizados =='true' ? "Finalizados":"Asignados");
        this.procesosFinalizados = params.procesosFinalizados;
        let primerItem = 0;
        this.procesando = true;
        console.log(this.tiluloSeccion);
        this.flujosIndemnizacionesService.getHistoricoProcesos(this.procesosFinalizados, this.itemPorPagina, primerItem).subscribe(data => {
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
      }else if (params.procesos === 'procesosPendientes'){    //Mostrar los procesos en espera por el suceso de algún evento
        this.tiluloSeccion = 'Procesos > Pendientes';
        this.parametroActivo = params.procesos;
        let primerItem = 0;
        this.procesando = true;
        this.flujosIndemnizacionesService.getProcesosPendientes(this.itemPorPagina, primerItem).subscribe(data => {
          if (data.tipoRespuesta == 'Exito') {
            this.totalDatos = data.totalItems;
            this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
            this.dataSource.paginator = this.paginator;
            console.log(this.estadoSeleccionado);
            console.log(data);
          }else{
            this.abrirSnackBar(data.mensaje);
          }
          this.procesando = false;
        });
      // }else if (params.procesos === 'procesosAnulados'){    //Mostrar todos los procesos anulados
      //   this.tiluloSeccion = 'Procesos > Anulados';
      //   this.parametroActivo = params.procesos;
      //   let primerItem = 0;
      //   this.flujosIndemnizacionesService.getProcesosAnulados(this.itemPorPagina, primerItem, null, null).subscribe(data => {
      //     if (data.tipoRespuesta == 'Exito') {
      //       this.totalDatos = data.totalItems;
      //       this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
      //       this.dataSource.paginator = this.paginator;
      //       console.log(this.estadoSeleccionado);
      //       console.log(data);
      //     }else{
      //       this.abrirSnackBar(data.mensaje);
      //     }
      //   });
      }

    });


  }

  actualizarListaTareas(): void {
    console.log("No deberia ver este valor")
    this.suscripcion = this.formularioGestionService.tareaCompletada.subscribe( value => {
      console.log("pro: "+value);
      this.tareaCompletada=value;
      if(this.tareaCompletada){
        console.log("pro22: ");
        console.log("datos: " + this.dataSource);
        console.log(this.dataSource.data);
        let dataSourceFiltro = this.dataSource.data.filter( tarea => tarea.idTarea !== this.formularioGestionService.idTarea);
        console.log(dataSourceFiltro);
        this.dataSource = new MatTableDataSource<TareaAbierta>(dataSourceFiltro);
        this.totalDatos = this.totalDatos -1;
        this.dataSource.paginator = this.paginator;
        this.formularioGestionService.setTareaCompletada(false);
        this.HighlightRow=null;
      }
    });
  }

  public getPagina(event:PageEvent){
    this.HighlightRow=null;
    this.pageEvent=event;
    if(event.pageSize <= this.totalDatos){

      let cantidadItems = event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * cantidadItems) ;
      }
      if (this.idRutaActiva === 'estadoSeleccionado') {

        this.flujosIndemnizacionesService.getTareasUsuario(this.usuarioActivo, this.estadoSeleccionado, cantidadItems, primerItem).subscribe(data => {
          if (data.tipoRespuesta == 'Exito') {
            this.totalDatos = data.totalItems;
            this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
          }else{
            this.abrirSnackBar(data.mensaje);
          }
        });
      }else if (this.idRutaActiva === 'procesosFinalizados'){
        this.flujosIndemnizacionesService.getHistoricoProcesos(this.procesosFinalizados, cantidadItems, primerItem).subscribe(data => {
          if (data.tipoRespuesta == 'Exito') {
            this.totalDatos = data.totalItems;
            this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
          }else{
            this.abrirSnackBar(data.mensaje);
          }
        });
      }else if (this.parametroActivo  === 'procesosPendientes'){
        this.flujosIndemnizacionesService.getProcesosPendientes(cantidadItems, primerItem).subscribe(data => {
          if (data.tipoRespuesta == 'Exito') {
            this.totalDatos = data.totalItems;
            this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
          }else{
            this.abrirSnackBar(data.mensaje);
          }
        });
      // }else if (this.parametroActivo  === 'procesosAnulados'){
      //   this.flujosIndemnizacionesService.getProcesosAnulados(cantidadItems, primerItem).subscribe(data => {
      //     if (data.tipoRespuesta == 'Exito') {
      //       this.totalDatos = data.totalItems;
      //       this.dataSource = new MatTableDataSource<TareaAbierta>(data.listaResultado);
      //     }else{
      //       this.abrirSnackBar(data.mensaje);
      //     }
      //   });
      }
    }
  }


  onProcesoSeleccionado(tarea: TareaAbierta,  index: any){
    this.HighlightRow = index;
    let procesoSeleccionado: String;
    procesoSeleccionado = tarea.idProceso;
    console.log(procesoSeleccionado);
    this.formularioGestionService.tareaDefinicion = tarea.idTareaDefinicion;
    this.formularioGestionService.idTarea = tarea.idTarea;
    this.router.navigate(['./id', procesoSeleccionado], {relativeTo: this.activatedRoute, skipLocationChange: false});

  }

  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }
}

