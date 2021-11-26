import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  getListarUsuarios(idTareaDef:string){
    return this.http.get<any>(this.Url + '/procesos/usuarios' + '/' + idTareaDef);
  }

  putReasignarUsuario(idProceso:string, idUsuario: string, idTarea:string){
    return this.http.put<any>(this.Url + '/procesos/reasignar' + '/' + idProceso  + '/' + idUsuario + '/' + idTarea, null);
  }

  putCambiarEstadoUsuario(idUsuario:number, estadoNuevo:number){
    console.log(idUsuario,estadoNuevo )
    return this.http.put<any>(this.Url + '/usuarios/gestion' + '/' + idUsuario  + '/' + estadoNuevo, null);
  }

}
