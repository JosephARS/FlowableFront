import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {  ActivatedRoute, Router } from '@angular/router';
import { TareaAbierta } from 'src/app/core/modelos/tarea-abierta';
import { FormularioGestionService } from 'src/app/core/servicios/components/formulario-gestion.service';
import { AuthService } from 'src/app/core/servicios/http/auth.service';
import { HomeService } from 'src/app/core/servicios/http/home.service';


@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {

  usuarioSeleccion: string;

  parametrosBusqueda: string[];
  parametroSeleccionado: string;
  valorBusqueda: string;
  procesoSeleccionado: string = '';

  displayedColumns: string[] = ['idConsecutivo', 'nombreTarea', 'fechaCreacion', 'fechaSolucion', 'tiempoSolucion', 'estado'];
  dataSource = new MatTableDataSource<any>();

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];

  pageEvent: PageEvent;
  HighlightRow: Number;
  procesando = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private homeService: HomeService,
              private router: Router,
              private formularioGestionService:FormularioGestionService,
              private authService: AuthService) {
    this.parametrosBusqueda = ['Consecutivo','Número de siniestro','Número de documento'];
    this.parametroSeleccionado ='';
    this.valorBusqueda = '';
    this.totalDatos = 0;
    this.itemPorPagina = 10;
    this.itemPorPaginaOpciones= [10, 25];
    this.usuarioSeleccion= "Analista1";
  }

  cambiarUsuario(){
    this.authService.username = this.usuarioSeleccion;
    console.log(this.usuarioSeleccion);
    console.log(this.authService.username);
  }

  ngOnInit(): void {
  }

  onClickBuscar(){
    console.log(this.parametroSeleccionado, this.valorBusqueda)
    if(this.parametroSeleccionado==='' || this.valorBusqueda===''){
      this.abrirSnackBar("Se requiere un parametro y un dato para iniciar búsqueda");
    }else{
      let primerItem = 0;
      this.procesando = true;
      this.homeService.getBusqueda(this.parametroSeleccionado, this.valorBusqueda, this.itemPorPagina, primerItem).subscribe(data => {
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
    this.HighlightRow=null;
    this.pageEvent=event;
    if(event.pageSize <= this.totalDatos){

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

    this.procesoSeleccionado = tarea.idProceso;

    if (tarea.fechaSolucion) {
      this.formularioGestionService.tareaDefinicion = "soloLecturaProcFinalizado";
    } else {
      this.formularioGestionService.tareaDefinicion = "soloLecturaProcAbierto";
    }
  //  this.router.navigate(['busqueda/id', procesoSeleccionado], {relativeTo: this.activatedRoute, skipLocationChange: false});

  }

  calcularFechaSolucion(fechaVence: number): string{

    const diffTime = (fechaVence - 1);
    var respuesta = '';
    console.log(fechaVence)

    if(fechaVence>0){
      let seconds = diffTime/1000 ;

      var h = Math.trunc(seconds / (3600));
      var m = ("00" + (Math.floor(seconds % 3600 / 60))).slice(-2);
      var s =  ("00" + (Math.floor(seconds % 60))).slice(-2);
      respuesta = h+':'+m +':'+s;
    }
    return respuesta;
}


  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }
}
