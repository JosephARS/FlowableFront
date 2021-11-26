import { EstadoSolucion } from "./estadoSolucion";

export class TareaAbierta {

  idConsecutivo: string = '';
  idProceso:string = '';
  idTarea:string = '';
  idTareaDefinicion = '';
  nombreTarea:string = '';
  fechaCreacion: Date = new Date();
  fechaSolucion: Date = new Date();
  tiempoSolucion: number = 0;
  estadoSolucion: EstadoSolucion;
}
