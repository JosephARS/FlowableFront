import { Ajustador } from "./ajustador";
import { Analisis } from "./analisis";
import { CanalAtencion } from "./canalAtencion";

import { DatosAnulacion } from "./datosAnulacion";
import { InfoAsegurado } from "./infoAsegurado";

import { InfoObjecion } from "./infoObjecion";
import { InfoPago } from "./infoPago";
import { InfoProceso } from "./infoProceso";
import { InfoProducto } from "./infoProducto";

import { InfoSiniestro } from "./infoSiniestro";
import { MetadataProceso } from "./metadataProceso";
import { VariablesCaso } from "./variables-caso";

export class DetalleProceso {

  idProceso: String;
  xml: String;
  metadata?:MetadataProceso;
  infoProceso?:InfoProceso;
  asegurado?:InfoAsegurado;
  infoProducto?:InfoProducto;
  siniestro?:InfoSiniestro;
  canalAtencion?:CanalAtencion;
  pago?:InfoPago;
  objecion?:InfoObjecion;
  ajustador?:Ajustador;
  anulacion?: DatosAnulacion;
  historialCaso?:string;
  historialAnalisis?:Analisis[];

  constructor(){

    this.infoProceso = new InfoProceso();
    this.asegurado = new InfoAsegurado();
    this.infoProducto = new InfoProducto();
    this.siniestro = new InfoSiniestro();
    this.canalAtencion = new CanalAtencion();
    this.pago = new InfoPago();
    this.objecion = new InfoObjecion();
    this.ajustador = new Ajustador();
    this.anulacion = new DatosAnulacion();
  }
}
