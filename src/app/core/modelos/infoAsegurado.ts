import { ObjetoCodigoValor } from "./objetoCodigoValor";

export class InfoAsegurado{
	 tipoDocumento: String;
	 numeroDocumento: String;
	 nombres: String;
	 apellidos: String;
	 numeroContacto: number;
	 email: String;
	 clv: ObjetoCodigoValor;						//Codigo-Valor
	 sarlaftActualizado: boolean;
}
