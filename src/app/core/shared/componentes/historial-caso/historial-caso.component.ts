import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InboxService } from 'src/app/core/servicios/http/inbox.service';


@Component({
  selector: 'app-historial-caso',
  templateUrl: './historial-caso.component.html',
  styleUrls: ['./historial-caso.component.scss']
})
export class HistorialCasoComponent implements OnInit {

  displayedColumns: string[] = ["orden","fechaInicio","usuario","nombreActividad","fechaFin","tiempoSolucion", "tipoActividad", "comentario"];
  dataSource = new MatTableDataSource<any>();
  arrDatosConFiltro: any;
  arrDatosSinFiltro: any;

  @Input() idProceso: string;

  constructor(private inboxService:InboxService,) {

   }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges){
    console.log("data" + this.idProceso);
    //this.ngOnInit();
    if(this.idProceso!==''){
      this.inboxService.getHistorialCaso(this.idProceso).subscribe(data =>{
        console.log(data);
        if (data.tipoRespuesta == 'Exito') {
          this.arrDatosSinFiltro = data.listaResultado;
          this.arrDatosConFiltro = this.arrDatosSinFiltro.filter(actividad => actividad.tipoActividad === "userTask");


          this.dataSource = new MatTableDataSource<any>(this.arrDatosConFiltro);

        }else{

        }


      });
    }
  }

  milisegundosAHoras(miliSeconds:number): string{
    let seconds = miliSeconds/1000 ;

    let h = Math.trunc(seconds / (3600));
    let m = ("00" + (Math.floor(seconds % 3600 / 60))).slice(-2);
    var s =  ("00" + (Math.floor(seconds % 60))).slice(-2);
    console.log(seconds);
    return h+':'+m +':'+s;
  }

  onOcultarDetalle($event){

    if ($event.checked) {
      this.dataSource = new MatTableDataSource<any>(this.arrDatosSinFiltro);
    } else {
      this.dataSource = new MatTableDataSource<any>(this.arrDatosConFiltro);
    }

  }

}
