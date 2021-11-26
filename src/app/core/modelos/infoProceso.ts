import { Documento } from "./documento";
import { ObjetoCodigoValor } from "./objetoCodigoValor";

export class InfoProceso{

  idProceso:string;
	idConsecutivo:string;
	estadoCreacion?:ObjetoCodigoValor;			//Codigo-Valor
	canalCreacion?: ObjetoCodigoValor;	      //Codigo-Valor
	usuarioCreador?:string;
	fechaCreacion?:Date;
	estadoSolicitud?:string;
  estadoFinal?:string;
	resultadoScoreRiesgo?: ObjetoCodigoValor;
	clasificacionCaso?: ObjetoCodigoValor;	        //Codigo-Valor
	resultadoMotorDefi?: ObjetoCodigoValor;				//Codigo-Valor
  cambioMotorDef?: ObjetoCodigoValor;
	motivoCambioMotorDef?:string;
	resultadoPruebaEstres?:string;
  resultadoEvidencia?:string;
  fechaDesistimiento?: Date;
	documentos?: Documento[];
  varProducto?: string[];

  constructor(){
    this.cambioMotorDef = new ObjetoCodigoValor();
  }
}
