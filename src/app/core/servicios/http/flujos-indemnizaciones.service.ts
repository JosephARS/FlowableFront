import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlujosIndemnizacionesService {

  constructor( private http: HttpClient) { }

  //Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';
  Url = environment.baseUrl;

  postDesplegar(){
    return this.http.post(this.Url + '/despliegue','');
  }

  getTareasUsuario(usuarioActivo:string, nombreTarea:string, itemPorPagina: number, primerItem: number){
    return this.http.get<any>(this.Url + '/tareas' + '/' + usuarioActivo + '/' + nombreTarea + '/' + itemPorPagina + '/' + primerItem);
  }

  getTareasAbiertas(usuarioActivo:string){
    return this.http.get<any>(this.Url + '/tareas/abiertas' + '/' + usuarioActivo);
  }

  getHistoricoProcesos(procesosFinalizados:boolean, itemPorPagina: number, primerItem: number, fechaInicio?: string, fechaFin?: string){
    let params = new HttpParams();
    console.log(fechaInicio + fechaFin)
    if(fechaInicio){
      params = params.append('fechaInicio',fechaInicio);
      params = params.append('fechaFin', fechaFin);
    }
    return this.http.get<any>((this.Url + '/historico/procesos' + '/' + procesosFinalizados + '/' + itemPorPagina + '/' + primerItem), {params: params} ) ;
  }

  getProcesosPendientes(itemPorPagina: number, primerItem: number, fechaInicio?: string, fechaFin?: string){
    let params = new HttpParams();
    console.log(fechaInicio + fechaFin)
    if(fechaInicio){
      params = params.append('fechaInicio',fechaInicio);
      params = params.append('fechaFin', fechaFin);
    }
    return this.http.get<any>((this.Url + '/historico/procesos/pendientes' + '/' + itemPorPagina + '/' + primerItem), {params: params} );
  }

  getProcesosAnulados(itemPorPagina: number, primerItem: number, fechaInicio?: string, fechaFin?: string){
    let params = new HttpParams();
    if(fechaInicio){
      params = params.append('fechaInicio',fechaInicio);
      params = params.append('fechaFin', fechaFin);
    }
    return this.http.get<any>((this.Url + '/historico/procesos/anulados' + '/' + itemPorPagina + '/' + primerItem) , {params: params} );
  }

  getProcesosSuspendidos(itemPorPagina: number, primerItem: number, fechaInicio?: string, fechaFin?: string){
    let params = new HttpParams();
    if(fechaInicio){
      params = params.append('fechaInicio',fechaInicio);
      params = params.append('fechaFin', fechaFin);
    }
    return this.http.get<any>((this.Url + '/historico/procesos/suspendidos' + '/' + itemPorPagina + '/' + primerItem) , {params: params} );
  }

  getProcesosErrorWS(itemPorPagina: number, primerItem: number, fechaInicio?: string, fechaFin?: string){
    let params = new HttpParams();
    if(fechaInicio){
      params = params.append('fechaInicio',fechaInicio);
      params = params.append('fechaFin', fechaFin);
    }
    return this.http.get<any>((this.Url + '/historico/procesos/errorws' + '/' + itemPorPagina + '/' + primerItem) , {params: params} );
  }

  postProcesosSuspendidos(idJob: string){
    return this.http.post<any>(this.Url + '/historico/procesos/suspendidos' + '/' + idJob, null );
  }
}
