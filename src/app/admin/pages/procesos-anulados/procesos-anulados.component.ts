import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

@Component({
  selector: 'app-procesos-anulados',
  templateUrl: './procesos-anulados.component.html',
  styleUrls: ['./procesos-anulados.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcesosAnuladosComponent implements OnInit {

  displayedColumns: string[] = ['idConsecutivo', 'fechaAnulacion','fechaCreacion', 'usuarioResponsable'];
  dataSource = new MatTableDataSource<any>();
  expandedElement: null;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];
  arrProcesosAnulados: object[];

  procesando: boolean = false;

  rangoFechas = new FormGroup({
    inicio: new FormControl(),
    fin: new FormControl()
  });

  fechaInicio:string = null;
  fechaFin:string = null;

  constructor(private flujosIndemnizacionesService: FlujosIndemnizacionesService, private snackBar: MatSnackBar) {
    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];

   }

  ngOnInit(): void {
    this.onBuscarProcesos();
  }


  onBuscarProcesos(){

    let primerItem = 0;
    this.procesando = true;
    this.flujosIndemnizacionesService.getProcesosAnulados(this.itemPorPagina, primerItem, this.fechaInicio, this.fechaFin).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatos = data.totalItems;
        this.dataSource = new MatTableDataSource<any>(data.listaResultado);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.procesando = false;
    });

  }

  public getPagina(event:PageEvent){
    if(event.pageSize <= this.totalDatos){
      let cantidadItems =  event.pageSize;
      let primerItem = 0;
      if (event.pageIndex>0) {
        primerItem = ((event.pageIndex ) * cantidadItems) ;
      }
      let fechaInicio = this.rangoFechas.value.inicio;
      let fechaFin = this.rangoFechas.value.fin;
      this.flujosIndemnizacionesService.getProcesosAnulados(cantidadItems, primerItem, fechaInicio, fechaFin).subscribe(data => {
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.totalDatos = data.totalItems;
          this.dataSource = new MatTableDataSource<any>(data.listaResultado);
        }else{
          this.abrirSnackBar(data.mensaje);
        }
      });
    }
  }

  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }

  onClickFiltrar(){
    if(this.rangoFechas.value.fin != null){

      let fechaAdd = new Date(this.rangoFechas.value.fin);
      this.fechaFin = (new Date(fechaAdd.setDate(fechaAdd.getDate() + 1))).toString(); //Agrega 1 día completo para cubrir las 24h del día.
      this.fechaInicio = (this.rangoFechas.value.inicio).toString();
      console.log(fechaAdd +'' + this.fechaFin);

      this.onBuscarProcesos();

    }else{
      this.abrirSnackBar("Seleccione un rango de fechas con formato válido");
    }
  }

}
