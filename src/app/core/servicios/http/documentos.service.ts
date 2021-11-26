import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DocumentoLista } from '../../modelos/documentoLista';
import { DocumentoNuevo } from '../../modelos/documentoNuevo';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient) { }

  Url = environment.baseUrl;

  getUlrDescargaDocumento(bucket: string, route: string){
    let getheaders = new HttpHeaders().set('Accept', 'application/json');
    let params = new HttpParams();

      params = params.append('Bucket',bucket);
      params = params.append('Key', route);

    return this.http.get<any>((this.Url + '/documentos/consulta' ), {params: params, headers: getheaders } ) ;
  }

  postCargaDocumento(idProceso:string, idConsecutivo: string, documentos: FormData){
    let params = new HttpParams();
    params = params.append('idConsecutivo',idConsecutivo);
    params = params.append('idProceso',idProceso);
    console.log(documentos);
    console.log("VAlorBase: " + documentos);
    return this.http.post<any>( this.Url + '/documentos/cargar', documentos , {params: params} ) ;
  }
}
