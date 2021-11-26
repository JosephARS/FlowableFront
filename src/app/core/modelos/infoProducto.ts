import { Cobertura } from "./cobertura";
import { ObjetoCodigoValor } from "./objetoCodigoValor";

export class InfoProducto{
	compania:ObjetoCodigoValor;
	ramo:ObjetoCodigoValor;		//Codigo-Valor
	producto:ObjetoCodigoValor;				//Codigo-Valor
	numeroPoliza:Number;
  numSecuPoliza: Number;
  numEndoso: Number;
	causa: ObjetoCodigoValor;						//ArrayList[Codigo-Valor]
	//consecuencia:ObjetoCodigoValor[];		//ArrayList[Codigo-Valor]
	//cobertura:ObjetoCodigoValor[];				//ArrayList[Codigo-Valor]
	cobertura: Cobertura[];
  riesgo:ObjetoCodigoValor;
}
