export class Ajustador{
	 asignado:string;
	 fechaAsignacion:Date;
	 fechaEntrega:Date;

   constructor(pAsignado:string =''){ //, pFechaAsignacion?: Date, pFechaEntrega?:Date){
    this.asignado =pAsignado;
    // this.fechaAsignacion = new Date(pFechaAsignacion);
    // this.fechaEntrega = new Date(pFechaEntrega);
   }
}
