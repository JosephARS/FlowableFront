import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor( private http: HttpClient) { }

  Url = 'http://localhost:80//flujos-indemnizaciones/api/v1';


  getBusqueda(parametroBusqueda:string, datoBusqueda:string, itemPorPagina: number, primerItem: number){
    return this.http.get<any>(this.Url + '/busqueda/' + '/' + parametroBusqueda + '/' + datoBusqueda + '/' + itemPorPagina + '/' + primerItem);
  }
}
