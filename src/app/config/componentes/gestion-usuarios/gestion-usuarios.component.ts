import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/core/modelos/usuario';
import { UsuariosService } from 'src/app/core/servicios/http/usuarios.service';
import { DialogoConfirmacionComponent } from 'src/app/core/shared/componentes/dialogo-confirmacion/dialogo-confirmacion.component';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {

  idTareaDefinicion: string;

  displayedColumns: string[] = ['identificacion', 'loginUsuario', 'activo', 'cambiar'];
  dataSource = new MatTableDataSource<any>();

  totalDatos: number;
  itemPorPagina : number;
  itemPorPaginaOpciones: number[];

  pageEvent: PageEvent;
  HighlightRow: number;
  procesando = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private usuariosService:UsuariosService,
              private snackBar: MatSnackBar,
              public dialogoConfirmacion: MatDialog) {
    this.idTareaDefinicion = "Todas";
   }

  ngOnInit(): void {
    this.HighlightRow=null;
    this.usuariosService.getListarUsuarios(this.idTareaDefinicion).subscribe(data => {
      console.log(data);
      if (data.tipoRespuesta == 'Exito') {
        this.totalDatos = data.totalItems;
        this.dataSource = new MatTableDataSource<Usuario>(data.listaResultado);
        this.dataSource.paginator = this.paginator;
        console.log(data);
      }else{
        this.abrirSnackBar(data.mensaje);
      }
      this.procesando = false;
    });
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

      // this.homeService.getBusqueda(this.parametroSeleccionado, this.valorBusqueda, this.itemPorPagina, primerItem).subscribe(data => {
      //   if (data.tipoRespuesta == 'Exito') {
      //     this.totalDatos = data.totalItems;
      //     this.dataSource = new MatTableDataSource<any>(data.listaResultado);
      //   }else{
      //     this.abrirSnackBar(data.mensaje);
      //   }
      // });

    }
  }

  onUsuarioSeleccionado(usuario: Usuario, index: number){
    console.log(usuario);
    this.HighlightRow=index;
    let estadoNuevo = (usuario.activo == 0) ? 1:0;

    this.dialogoConfirmacion
    .open(DialogoConfirmacionComponent, {
      data: `¿Desea cambiar el estado del usuario ${usuario.loginUsuario} a ${usuario.activo === 0 ? "Activo":"Inactivo" }?`
    })
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        this.procesando = true;
        this.usuariosService.putCambiarEstadoUsuario(usuario.idUsuario, estadoNuevo).subscribe(data => {
          console.log(data);
          if (data.tipoRespuesta == 'Exito') {
            let dataSourceFiltro = this.dataSource.data;
            dataSourceFiltro[this.HighlightRow].activo = estadoNuevo;
            console.log(dataSourceFiltro[0].activo);
            this.dataSource = new MatTableDataSource<any>(dataSourceFiltro);
            this.totalDatos = this.totalDatos -1;
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
