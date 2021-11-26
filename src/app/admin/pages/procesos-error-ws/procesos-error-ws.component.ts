import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Proceso } from 'src/app/core/modelos/proceso';
import { ProcesoErrorWs } from 'src/app/core/modelos/procesoErrorWs';
import { FormularioGestionService } from 'src/app/core/servicios/components/formulario-gestion.service';
import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

@Component({
  selector: 'app-procesos-error-ws',
  templateUrl: './procesos-error-ws.component.html',
  styleUrls: ['./procesos-error-ws.component.scss'],
  animations:[
    trigger('ocultaVentana',[
      state('visible',style({
        'transform': 'translateX(-100%)'
      })),
      state('oculto',style({

      })),
      transition('* => *',[
        animate('.5s ease')
      ])
    ])
  ]
})
export class ProcesosErrorWSComponent implements OnInit {

  displayedColumns: string[] = ['idConsecutivo','actividadError', 'fechaError'];
  dataSourceSuspendidos = new MatTableDataSource<any>();
  dataSourceErrorWS = new MatTableDataSource<any>();
  procesosFinalizados:boolean;

  @ViewChild(MatPaginator) paginatorSuspendidos!: MatPaginator;
  @ViewChild(MatPaginator) paginatorErrorWS!: MatPaginator;
  totalDatosSuspendidos: number;
  itemPorPaginaSuspendidos : number;
  itemPorPaginaOpcionesSuspendidos: number[];
  totalDatosErrorWS: number;
  itemPorPaginaErrorWS : number;
  itemPorPaginaOpcionesErrorWS: number[];
  procesando: boolean = false;

  rangoFechas = new FormGroup({
    inicio: new FormControl(),
    fin: new FormControl()
  });

  fechaInicio:string = null;
  fechaFin:string = null;
  ventanaEmergente = '';
  procesoError = new ProcesoErrorWs;

  constructor(private activatedRoute: ActivatedRoute,
              private flujosIndemnizacionesService: FlujosIndemnizacionesService,
              private snackBar: MatSnackBar,
              private formularioGestionService:FormularioGestionService,
              private router: Router,) {
    this.totalDatosSuspendidos = 0;
    this.itemPorPaginaSuspendidos = 10;
    this.itemPorPaginaOpcionesSuspendidos= [10, 25];
    this.totalDatosErrorWS = 0;
    this.itemPorPaginaErrorWS = 10;
    this.itemPorPaginaOpcionesErrorWS= [10, 25];
    this.procesosFinalizados = true;

   }

   ngOnInit(): void {
    this.onBuscarProcesos();
  }


  onBuscarProcesos(){

    let primerItem = 0;
    this.procesando = true;
    this.flujosIndemnizacionesService.getProcesosSuspendidos(this.itemPorPaginaSuspendidos, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatosSuspendidos = data.totalItems;
        this.dataSourceSuspendidos = new MatTableDataSource<Proceso>(data.listaResultado);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.procesando = false;
    });
    this.flujosIndemnizacionesService.getProcesosErrorWS(this.itemPorPaginaErrorWS, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatosErrorWS = data.totalItems;
        this.dataSourceErrorWS = new MatTableDataSource<Proceso>(data.listaResultado);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.procesando = false;
    });


  }

  public getPaginaSuspendidos(event:PageEvent){
    if(event.pageSize <= this.totalDatosSuspendidos){
      this.itemPorPaginaSuspendidos=  event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * this.itemPorPaginaSuspendidos) ;
      }
      this.procesando = true;

      this.flujosIndemnizacionesService.getProcesosSuspendidos(this.itemPorPaginaSuspendidos, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatosSuspendidos = data.totalItems;
          this.dataSourceSuspendidos = new MatTableDataSource<Proceso>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
        this.procesando = false;
      });
    }
  }

  public getPaginaErrorWS(event:PageEvent){
    if(event.pageSize <= this.totalDatosErrorWS){
      this.itemPorPaginaErrorWS=  event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * this.itemPorPaginaErrorWS) ;
      }
      this.procesando = true;

      this.flujosIndemnizacionesService.getProcesosErrorWS(this.itemPorPaginaErrorWS, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatosErrorWS = data.totalItems;
          this.dataSourceErrorWS = new MatTableDataSource<Proceso>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
        this.procesando = false;
      });
    }
  }

  onClickFiltrar(){
    if(this.rangoFechas.value.fin != null){

      let fechaAdd = new Date(this.rangoFechas.value.fin);
      this.fechaFin = (new Date(fechaAdd.setDate(fechaAdd.getDate() + 1))).toString(); //Agrega 1 día completo para cubrir las 24h del día.
      this.fechaInicio = (this.rangoFechas.value.inicio).toString();
      console.log(this.fechaInicio +' '+ this.fechaFin);

      this.onBuscarProcesos();

    }else{
      this.abrirSnackBar("Seleccione un rango de fechas con formato válido");
    }
  }

  abrirVentana(row, abrir:boolean){

    this.ventanaEmergente = abrir ? 'visible':'oculto';
    this.procesoError = row;
  }

  onEjecutarReintento(idJob:string){
    this.procesando = true;
    this.flujosIndemnizacionesService.postProcesosSuspendidos(idJob).subscribe( data => {
      if (data.tipoRespuesta == 'Exito') {
        let dataSource = this.dataSourceSuspendidos.data.filter( item => item.idJob !== idJob);
        this.dataSourceSuspendidos = new MatTableDataSource<Proceso>(dataSource);
        this.abrirVentana(null, false);
        this.procesoError = new ProcesoErrorWs;
      }
      this.abrirSnackBar(data.mensaje);
      this.procesando = false;
    })
  }

  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }


}
