import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcularVencimientoPipe'
})
export class CalcularVencimientoPipePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {

    var respuesta = '';

    if(value>0){
      let seconds = value/1000 ;

      var h = ("00" + Math.trunc(seconds / (3600))).slice(-2);
      var m = ("00" + Math.abs(Math.floor(seconds % 3600 / 60))).slice(-2);
      var s =  ("00" + Math.abs(Math.floor(seconds % 60))).slice(-2);
      respuesta = h+':'+m +':'+s;

    }

    return respuesta;
  }

}
