import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosAnulacion } from '../../modelos/datosAnulacion';

@Injectable({
  providedIn: 'root'
})
export class AnulacionService {

  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  getProcesosAbiertos(identificacionAsegurado:string, cantidadItems: number, primerItem: number){
    return this.http.get<any>(this.Url + '/procesos/abiertos' + '/' + identificacionAsegurado + '/'  + cantidadItems + '/' + primerItem);
  }

  deleteAnularProceso(datosAnulacion: DatosAnulacion, idProceso: string){
    return this.http.put<any>(this.Url + '/procesos/anular' + '/' + idProceso  , datosAnulacion);
  }


}
