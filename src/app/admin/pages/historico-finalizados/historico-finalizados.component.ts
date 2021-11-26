import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Proceso } from 'src/app/core/modelos/proceso';
import { FormularioGestionService } from 'src/app/core/servicios/components/formulario-gestion.service';
import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

@Component({
  selector: 'app-historico-finalizados',
  templateUrl: './historico-finalizados.component.html',
  styleUrls: ['./historico-finalizados.component.scss']
})
export class HistoricoFinalizadosComponent implements OnInit {

  displayedColumns: string[] = ['idConsecutivo','nombreActividad', 'fechaCreacion','fechaSolucion', 'tiempoSolucion'];
  dataSource = new MatTableDataSource<any>();

  procesosFinalizados:boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  HighlightRow!: number;
  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];
  arrProcesosFinalizados: object[];
  procesoSeleccionado: string = '';
  procesando: boolean = false;

  rangoFechas = new FormGroup({
    inicio: new FormControl(),
    fin: new FormControl()
  });

  fechaInicio:string = null;
  fechaFin:string = null;

  constructor(private activatedRoute: ActivatedRoute,
              private flujosIndemnizacionesService: FlujosIndemnizacionesService,
              private snackBar: MatSnackBar,
              private formularioGestionService:FormularioGestionService,
              private router: Router,) {
    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];
    this.procesosFinalizados = true;

   }

   ngOnInit(): void {
    this.onBuscarProcesos();
  }


  onBuscarProcesos(){

    let primerItem = 0;
    this.procesando = true;
    this.flujosIndemnizacionesService.getHistoricoProcesos(this.procesosFinalizados, this.itemPorPagina, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatos = data.totalItems;
        this.dataSource = new MatTableDataSource<Proceso>(data.listaResultado);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.procesando = false;
    });

  }

  public getPagina(event:PageEvent){
    if(event.pageSize <= this.totalDatos){
      this.itemPorPagina=  event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * this.itemPorPagina) ;
      }
      this.procesando = true;

      this.flujosIndemnizacionesService.getHistoricoProcesos(this.procesosFinalizados, this.itemPorPagina, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatos = data.totalItems;
          this.dataSource = new MatTableDataSource<Proceso>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
        this.procesando = false;
      });
    }
  }

   onProcesoSeleccionado(proceso: Proceso,  index: number){
    this.HighlightRow = index;
    this.procesoSeleccionado = proceso.idProceso;
    this.formularioGestionService.tareaDefinicion = '';
    this.formularioGestionService.idTarea = '';
    console.log(this.procesoSeleccionado);
    //this.router.navigate(['./id', procesoSeleccionado], {relativeTo: this.activatedRoute, skipLocationChange: true});

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

  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }
}
