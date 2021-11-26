import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Analisis } from 'src/app/core/modelos/analisis';


@Injectable({
  providedIn: 'root'
})
export class HistorialAnalisisService {

  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  putAgregarAnalisis(idProceso:string, oAnalisis: Analisis){
    return this.http.put<any>(this.Url + '/procesos/analisis' + '/' + idProceso, oAnalisis);
  }
}
