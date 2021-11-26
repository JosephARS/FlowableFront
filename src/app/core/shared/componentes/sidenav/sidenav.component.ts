import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PerfilGuard } from 'src/app/core/auth/guards/perfil.guard';
import { AuthService } from 'src/app/core/servicios/http/auth.service';

import { FlujosIndemnizacionesService } from 'src/app/core/servicios/http/flujos-indemnizaciones.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  usuarioActivo: string = '';
  tareasSinFinalizar: any = [] ;
  tareasFinalizadas!: number;
  totalTareas:number;
  perfilGuard: PerfilGuard;
  //@Output() estadoSeleccionado: EventEmitter<TareaAbierta>;

  constructor(private flujosIndemnizacionesService: FlujosIndemnizacionesService,
              private router: Router,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              ) {
    this.usuarioActivo = this.authService.getLoggedInUserName(); //authenticationService.getLoggedInUserName();
    this.tareasSinFinalizar = [] ;
    this.totalTareas=0;
   }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.usuarioActivo = this.authService.username;
  //   console.log(this.usuarioActivo);
  //   //throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    this.onActualizarTareas();

  }

  onActualizarTareas(){
    this.usuarioActivo = this.authService.getLoggedInUserName();
    this.flujosIndemnizacionesService.getTareasAbiertas(this.usuarioActivo).subscribe(data => {
      if (data.tipoRespuesta == 'Error') {
        this.abrirSnackBar(data.mensaje);
      }else{
      this.totalTareas=0;
      this.tareasSinFinalizar = data.listaResultado;
      this.tareasSinFinalizar.forEach(element => {
        this.totalTareas = this.totalTareas + element.valor;
        console.log(element.valor)
      });
      console.log(data);
      }
    });
  }

  onEstadoSeleccionado(tarea: any){
    console.log("Hola")
    let estadoSeleccionado: String = "";
    let currentUrl = this.router.url;
    estadoSeleccionado = tarea.codigo;
    this.router.navigateByUrl('/', {skipLocationChange: false})
                .then( () => this.router.navigate(['/procesos', estadoSeleccionado]));


  //  this.router.navigate(['/procesos', estadoSeleccionado],{skipLocationChange: false});
  }

  onListarProceso(){
    this.router.navigate(['/administrar/anulacion/']);

  }

  onPruebas(){
    window.confirm('Do you really want to exit?');
    this.router.navigate(['/administrar/prueba/']);
  }

  onReasignarProceso(){
    this.router.navigate(['/administrar/reasignacion/']);
  }

  onListarHistorico(procesosFinalizados: boolean){
    if(procesosFinalizados){
      this.router.navigate(['/administrar/historico/procesosFinalizados']);
    }else{
      this.router.navigate(['/administrar/historico/procesosActivos', procesosFinalizados]);
    }
  }

  onListarProcesosPendientes(){
    this.router.navigate(['/administrar/historico/procesosPendientes/', 'procesosPendientes']);
  }

  onListarProcesosAnulados(){
    this.router.navigate(['/administrar/historico/procesosAnulados']);
  }

  onListarProcesosSuspendidos(){
    this.router.navigate(['/administrar/historico/procesosSuspendidos']);
  }

  onClickReporteA(){
    this.router.navigate(['/administrar/reporteA']);

  }


  public abrirSnackBar(mensaje:string) {
    let config = new MatSnackBarConfig();
    config.duration = 6000;
    config.verticalPosition = "top";
    config.panelClass = ['blue-snackbar'];

    this.snackBar.open(mensaje, 'Ocultar', config);
  }

}
