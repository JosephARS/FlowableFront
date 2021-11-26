import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  getReporteTareasActivas(){
    return this.http.get<any>(this.Url + '/administrar/reporte/tareasActivas' );
  }
}
