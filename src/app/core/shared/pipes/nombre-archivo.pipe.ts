import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreArchivo'
})
export class NombreArchivoPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {

    return value.split('/').splice(-1).join();
  }

}
