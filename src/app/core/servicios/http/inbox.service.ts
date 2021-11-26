import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleProceso } from 'src/app/core/modelos/detalleProceso';


@Injectable({
  providedIn: 'root'
})
export class InboxService {

  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  getRutaDelProceso(idProceso:string){
    return this.http.get<any>(this.Url + '/procesos/infoDetalle/ruta' + '/' + idProceso);
  }

  getDatosProcesoDetalle(idProceso:string){
    return this.http.get<any>(this.Url + '/procesos/infoDetalle' + '/' + idProceso);
  }

  postCompletarTarea(idTarea, idTareaDefinicion, idUsuario, procesoActualizado: DetalleProceso){
    console.log(idTarea)
    console.log(idTareaDefinicion)
    console.log(idUsuario)
    console.log(procesoActualizado)
    return this.http.post<any>(this.Url + '/usuario/tareaAtendida' + '/' + idTarea + '/' + idTareaDefinicion+ '/' + idUsuario, procesoActualizado);
  }

  getHistorialCaso(idProceso:string){
    return this.http.get<any>(this.Url + '/procesos/historialCaso' + '/' + idProceso);
  }

  postCorregirActividad(procesoActualizado: DetalleProceso){
    return this.http.post<any>(this.Url + '/corregirActividad' , procesoActualizado);
  }

}
