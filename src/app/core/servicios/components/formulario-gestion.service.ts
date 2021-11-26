import { EventEmitter, Injectable } from '@angular/core';
import { DetalleProceso } from '../../modelos/detalleProceso';



@Injectable({
  providedIn: 'root'
})
export class FormularioGestionService {

  detalleProceso: DetalleProceso;
  xml:string;
  idProcesoActual: string;
  idTarea: string;
  tareaDefinicion: string;
  tareaCompletada = new EventEmitter<boolean>();
  //tareaCompletadaObservable: Observable<boolean> = new Observable<boolean>();

  constructor() {
    this.detalleProceso = new DetalleProceso();
  }

  setTareaCompletada(valor: boolean){
     if(valor){
      this.tareaCompletada.emit(valor);
     }
   }

}
